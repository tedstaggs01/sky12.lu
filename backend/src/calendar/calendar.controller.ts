import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CalendarService } from "./calendar.service.js";
import { parseDay } from "./dates.js";
import { directCalendar } from "./ical.js";

@Controller()
export class CalendarController {
  constructor(
    private readonly calendar: CalendarService,
    private readonly config: ConfigService,
  ) {}

  @Get("availability")
  async availability(@Query("from") from: string, @Query("to") to: string) {
    const start = parseDay(from);
    const end = parseDay(to);
    if (!start || !end || end <= start) {
      throw new BadRequestException("Use from and to as YYYY-MM-DD.");
    }
    return { blocked: await this.calendar.blockedNights(start, end) };
  }

  @Get("ical/sky12.ics")
  @Header("Content-Type", "text/calendar; charset=utf-8")
  async ical() {
    return directCalendar(await this.calendar.directHolds());
  }

  @Post("holds")
  async createHold(
    @Headers("x-hold-token") token: string | undefined,
    @Body() body: { checkIn?: string; checkOut?: string },
  ) {
    this.authorize(token);
    const checkIn = parseDay(body.checkIn);
    const checkOut = parseDay(body.checkOut);
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      throw new BadRequestException("Use checkIn and checkOut as YYYY-MM-DD.");
    }
    return this.calendar.createDirect(checkIn, checkOut);
  }

  @Delete("holds/:id")
  async removeHold(@Headers("x-hold-token") token: string | undefined, @Param("id") id: string) {
    this.authorize(token);
    const removed = await this.calendar.removeDirect(id);
    if (!removed) throw new NotFoundException();
    return { ok: true };
  }

  private authorize(token: string | undefined) {
    const secret = this.config.get<string>("HOLD_SECRET");
    if (!secret || token !== secret) throw new UnauthorizedException();
  }
}
