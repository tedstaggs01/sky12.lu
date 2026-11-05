import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { BlockSource } from "./block.schema.js";
import { CalendarService } from "./calendar.service.js";
import { parseIcal } from "./ical.js";

const everyFifteenMinutes = 15 * 60 * 1000;

@Injectable()
export class CalendarSyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CalendarSyncService.name);
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly calendar: CalendarService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    void this.sync();
    this.timer = setInterval(() => void this.sync(), everyFifteenMinutes);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async sync() {
    await this.pull("airbnb", this.config.get<string>("AIRBNB_ICAL_URL"));
    await this.pull("booking", this.config.get<string>("BOOKING_ICAL_URL"));
  }

  private async pull(source: Exclude<BlockSource, "direct">, url: string | undefined) {
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const ranges = parseIcal(await response.text());
      await this.calendar.replaceSource(source, ranges);
      this.logger.log(`Imported ${ranges.length} ${source} stays`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "import failed";
      this.logger.warn(`Kept the previous ${source} calendar: ${message}`);
    }
  }
}
