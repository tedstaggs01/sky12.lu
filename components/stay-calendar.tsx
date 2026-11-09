"use client";

import { useEffect, useMemo, useState } from "react";

type Labels = {
  basePrice: string;
  perNight: string;
  cheaper: string;
  checkIn: string;
  checkOut: string;
  addDate: string;
  clear: string;
  previous: string;
  next: string;
  oneNight: string;
  manyNights: string;
  total: string;
  rateNote: string;
  selectStay: string;
  unavailable: string;
  taken: string;
};

function dayTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function isoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function nightsHitBlock(start: Date, end: Date, blocked: Set<string>) {
  const cursor = new Date(dayTime(start));
  const last = dayTime(end);
  while (cursor.getTime() < last) {
    if (blocked.has(isoDate(cursor))) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

function nightsBetween(start: Date, end: Date) {
  return Math.round((dayTime(end) - dayTime(start)) / 86_400_000);
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function StayCalendar({
  locale,
  price,
  currency,
  phone,
  enquireLabel,
  labels,
  apiUrl,
}: {
  locale: string;
  price: number;
  currency: string;
  phone: string;
  enquireLabel: string;
  labels: Labels;
  apiUrl: string;
}) {
  const today = dayTime(new Date());
  const [visible, setVisible] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [taken, setTaken] = useState(false);

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [locale, currency],
  );
  const monthFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );
  const dayFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }),
    [locale],
  );
  const fullFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }),
    [locale],
  );
  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return Array.from({ length: 7 }, (_, index) => format.format(new Date(2026, 0, 5 + index)));
  }, [locale]);

  const year = visible.getFullYear();
  const month = visible.getMonth();

  useEffect(() => {
    const from = isoDate(new Date(year, month, 1));
    const to = isoDate(new Date(year, month + 2, 1));
    const controller = new AbortController();
    fetch(`${apiUrl}/availability?from=${from}&to=${to}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((body: { blocked?: string[] }) => setBlocked(new Set(body.blocked ?? [])))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setBlocked(new Set());
      });
    return () => controller.abort();
  }, [apiUrl, year, month]);

  const cells = monthCells(year, month);
  const now = new Date();
  const atFirstMonth = year === now.getFullYear() && month === now.getMonth();
  const rangeEnd = checkOut ?? (checkIn && hover && dayTime(hover) > dayTime(checkIn) ? hover : null);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const total = nights * price;
  const amount = money.format(price);
  const platformAmount = money.format(Math.round(price / 0.9));
  const nightsLine =
    nights === 1
      ? labels.oneNight.replace("{count}", "1").replace("{price}", amount)
      : labels.manyNights.replace("{count}", String(nights)).replace("{price}", amount);

  function pick(day: Date) {
    const time = dayTime(day);
    if (time < today || blocked.has(isoDate(day))) return;
    setTaken(false);
    if (!checkIn || checkOut || time <= dayTime(checkIn)) {
      setCheckIn(day);
      setCheckOut(null);
      return;
    }
    if (nightsHitBlock(checkIn, day, blocked)) return;
    setCheckOut(day);
  }

  async function enquire(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!checkIn || !checkOut) return;
    event.preventDefault();
    const from = isoDate(checkIn);
    const to = isoDate(checkOut);
    try {
      const response = await fetch(`${apiUrl}/availability?from=${from}&to=${to}`);
      if (response.ok) {
        const body = (await response.json()) as { blocked?: string[] };
        if ((body.blocked ?? []).some((night) => night >= from && night < to)) {
          setBlocked((current) => new Set([...current, ...(body.blocked ?? [])]));
          setCheckOut(null);
          setTaken(true);
          return;
        }
      }
    } catch {
      // The enquiry still goes to Ted if the calendar cannot be reached.
    }
    window.location.href = enquireHref;
  }

  const enquireHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div>
      <p className="text-sm text-muted">{labels.basePrice}</p>
      <p className="mt-1 text-[22px] font-semibold tracking-tight">
        <span className="mr-2 text-base font-normal text-muted line-through">{platformAmount}</span>
        {amount} <span className="text-base font-normal text-muted">{labels.perNight}</span>
      </p>
      <p className="mt-2 inline-flex rounded-full bg-[#1d6a8a] px-2.5 py-1 text-[12px] font-medium text-white">
        {labels.cheaper}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label={labels.previous}
            disabled={atFirstMonth}
            onClick={() => setVisible(new Date(year, month - 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 disabled:cursor-default disabled:opacity-30"
          >
            ‹
          </button>
          <p className="text-sm font-medium capitalize">{monthFormat.format(visible)}</p>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => setVisible(new Date(year, month + 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100"
          >
            ›
          </button>
        </div>
        <div className="mt-3 grid grid-cols-7 text-center text-[11px] text-muted">
          {weekdays.map((day, index) => (
            <div key={`${day}-${index}`} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} />;
            const time = dayTime(day);
            const unavailable = blocked.has(isoDate(day));
            const disabled = time < today || unavailable;
            const start = checkIn ? dayTime(checkIn) : null;
            const end = rangeEnd ? dayTime(rangeEnd) : null;
            const isStart = start === time;
            const isEnd = end === time && checkOut !== null && dayTime(checkOut) === time;
            const inRange = start !== null && end !== null && time > start && time < end;
            const endpoint = isStart || isEnd;

            return (
              <button
                key={time}
                type="button"
                disabled={disabled}
                onClick={() => pick(day)}
                onMouseEnter={() => setHover(day)}
                onMouseLeave={() => setHover(null)}
                aria-pressed={endpoint}
                aria-label={
                  unavailable
                    ? `${fullFormat.format(day)}, ${labels.unavailable}`
                    : `${fullFormat.format(day)}, ${amount}`
                }
                className={`flex h-11 flex-col items-center justify-center rounded-lg text-[13px] ${
                  endpoint
                    ? "bg-neutral-950 text-white"
                    : inRange
                      ? "bg-neutral-100"
                      : disabled
                        ? "cursor-default text-neutral-300"
                        : "cursor-pointer hover:bg-neutral-50"
                }`}
              >
                <span className="leading-none">{day.getDate()}</span>
                {disabled ? null : (
                  <span
                    className={`mt-0.5 text-[9px] leading-none ${endpoint ? "text-white/80" : "text-muted"}`}
                  >
                    {price}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-line text-sm">
        <div className={`border-r border-line px-3 py-2 ${checkIn && !checkOut ? "bg-neutral-50" : ""}`}>
          <p className="text-[11px] text-muted">{labels.checkIn}</p>
          <p className="font-medium">{checkIn ? dayFormat.format(checkIn) : labels.addDate}</p>
        </div>
        <div className="px-3 py-2">
          <p className="text-[11px] text-muted">{labels.checkOut}</p>
          <p className="font-medium">{checkOut ? dayFormat.format(checkOut) : labels.addDate}</p>
        </div>
      </div>

      {checkIn || checkOut ? (
        <button
          type="button"
          onClick={() => {
            setCheckIn(null);
            setCheckOut(null);
            setTaken(false);
          }}
          className="mt-2 cursor-pointer text-xs font-medium underline"
        >
          {labels.clear}
        </button>
      ) : (
        <p className="mt-2 text-xs text-muted">{labels.selectStay}</p>
      )}
      {taken ? <p className="mt-2 text-xs text-muted">{labels.taken}</p> : null}

      {nights > 0 ? (
        <div className="mt-4 border-t border-line pt-4" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <p>{nightsLine}</p>
            <p className="font-medium">{money.format(total)}</p>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">{labels.rateNote}</p>
        </div>
      ) : null}

      <a
        href={enquireHref}
        onClick={enquire}
        className="mt-4 flex h-12 items-center justify-center rounded-lg bg-neutral-950 text-sm font-medium text-white"
      >
        {enquireLabel}
      </a>
    </div>
  );
}
