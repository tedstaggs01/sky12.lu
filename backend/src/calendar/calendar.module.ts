import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Block, BlockSchema } from "./block.schema.js";
import { CalendarController } from "./calendar.controller.js";
import { CalendarService } from "./calendar.service.js";
import { CalendarSyncService } from "./calendar-sync.service.js";

@Module({
  imports: [MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }])],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarSyncService],
})
export class CalendarModule {}
