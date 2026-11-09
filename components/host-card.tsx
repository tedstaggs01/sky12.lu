"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

function TurnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 13.7-5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5 18 7.2 14.2 7.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12a8 8 0 0 1-13.7 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7.5 20.5 6 16.8 9.8 16.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HostCard({
  name,
  role,
  turn,
  turnBack,
  children,
}: {
  name: string;
  role: string;
  turn: string;
  turnBack: string;
  children: ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  const face =
    "col-start-1 row-start-1 flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_6px_16px_rgba(0,0,0,0.06)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

  return (
    <div className="mt-4 [perspective:1400px]">
      <div
        className={`grid transition-transform duration-700 ease-out [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-expanded={flipped}
          inert={flipped}
          className={`${face} cursor-pointer items-center justify-center text-center`}
        >
          <span className="relative h-14 w-14 overflow-hidden rounded-full">
            <Image
              src="/photos/host.jpg"
              alt=""
              fill
              className="object-cover object-[center_22%]"
              sizes="56px"
            />
          </span>
          <span className="mt-3 text-lg font-semibold tracking-tight">{name}</span>
          {role ? <span className="mt-0.5 text-sm text-muted">{role}</span> : null}
          <span className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
            <TurnIcon />
            {turn}
          </span>
        </button>

        <div
          inert={!flipped}
          onClick={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest("a")) return;
            setFlipped(false);
          }}
          className={`${face} cursor-pointer [transform:rotateY(180deg)]`}
        >
          <div className="text-left">{children}</div>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="mt-auto inline-flex items-center gap-2 pt-4 text-sm text-muted"
          >
            <TurnIcon />
            {turnBack}
          </button>
        </div>
      </div>
    </div>
  );
}
