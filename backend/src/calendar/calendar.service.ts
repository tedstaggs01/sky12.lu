import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Types, type Model } from "mongoose";
import { Block, type BlockDocument, type BlockSource } from "./block.schema.js";
import { nightsInWindow } from "./dates.js";
import type { StayRange } from "./ical.js";

@Injectable()
export class CalendarService {
  constructor(@InjectModel(Block.name) private readonly blocks: Model<BlockDocument>) {}

  async blockedNights(from: string, to: string) {
    const docs = await this.blocks.find({ checkIn: { $lt: to }, checkOut: { $gt: from } }).lean();
    const nights = new Set<string>();
    for (const doc of docs) {
      for (const night of nightsInWindow(doc.checkIn, doc.checkOut, from, to)) {
        nights.add(night);
      }
    }
    return [...nights].sort();
  }

  async replaceSource(source: Exclude<BlockSource, "direct">, ranges: StayRange[]) {
    await this.blocks.deleteMany({ source });
    if (ranges.length === 0) return;
    await this.blocks.insertMany(ranges.map((range) => ({ ...range, source })));
  }

  async directHolds() {
    const docs = await this.blocks.find({ source: "direct" }).sort({ checkIn: 1 }).lean();
    return docs.map((doc) => ({
      id: String(doc._id),
      checkIn: doc.checkIn,
      checkOut: doc.checkOut,
    }));
  }

  async createDirect(checkIn: string, checkOut: string) {
    const overlap = await this.blocks.findOne({
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });
    if (overlap) throw new ConflictException("Those dates are already blocked.");
    const created = await this.blocks.create({ source: "direct", checkIn, checkOut });
    return { id: String(created._id), checkIn, checkOut };
  }

  async removeDirect(id: string) {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this.blocks.findOneAndDelete({ _id: id, source: "direct" });
    return result !== null;
  }
}
