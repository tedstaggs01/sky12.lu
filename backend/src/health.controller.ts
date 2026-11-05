import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import type { Connection } from "mongoose";

@Controller()
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get("health")
  async health() {
    const database = this.connection.db;
    if (!database) {
      return { ok: false, database: "disconnected" };
    }

    await database.admin().command({ ping: 1 });
    return { ok: true, database: "connected" };
  }
}
