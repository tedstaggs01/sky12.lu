import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type BlockSource = "airbnb" | "booking" | "direct";

export type BlockDocument = HydratedDocument<Block>;

@Schema({ collection: "blocks" })
export class Block {
  @Prop({ required: true, enum: ["airbnb", "booking", "direct"] })
  source!: BlockSource;

  @Prop({ required: true })
  checkIn!: string;

  @Prop({ required: true })
  checkOut!: string;

  @Prop()
  uid?: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
