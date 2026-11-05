import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CalendarModule } from "./calendar/calendar.module.js";
import { HealthController } from "./health.controller.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: await mongoUri(config.get<string>("MONGODB_URI")),
      }),
    }),
    CalendarModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

const memoryServers: MongoMemoryServer[] = [];

async function mongoUri(configured: string | undefined) {
  if (configured) return configured;

  const memory = await MongoMemoryServer.create();
  memoryServers.push(memory);
  return memory.getUri("sky12");
}
