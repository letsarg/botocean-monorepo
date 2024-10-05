import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Token } from './token.schema';
import * as mongoose from 'mongoose';
import { ProcessCurrentProgress } from 'src/enum';

export type BotProcessDocument = BotProcess & Document;

@Schema()
export class BotProcess {
  @Prop({ required: true })
  containerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
  token?: Token;

  @Prop({ required: true })
  timestampCreation: number;

  @Prop()
  timestampTerminated?: number;

  @Prop()
  timestampFill?: number;

  @Prop({ required: true })
  shouldTerminate: boolean;

  @Prop({ required: true, type: String, enum: ProcessCurrentProgress })
  currentProgress: ProcessCurrentProgress;

  @Prop({ required: true })
  ip: string;
}

export const BotProcessSchema = SchemaFactory.createForClass(BotProcess);
