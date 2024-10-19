import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Network, Platform } from 'src/enum';
import { Wallet } from './wallet.schema';
import { Trade } from './trade.schema';

export type TokenDocument = Token & Document;
export class TokenDetailsPump {
  bondingCurve: string;
  associatedBondingCurve: string;
  cid: string;
}
@Schema()
export class Token {
  @Prop({ required: true })
  address: string;

  @Prop()
  signature?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  cidImage: string;

  @Prop()
  timestamp?: number;

  @Prop({ required: true })
  timestampCreation: number;

  @Prop({
    required: true,
    type: String,
    enum: Platform,
  })
  platform: Platform;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  deployer?: Wallet;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }] })
  trades?: Trade[];

  @Prop({ required: true })
  decimalToken?: number;

  @Prop({ required: true })
  decimalNative?: number;

  @Prop({ required: true, type: String, enum: Network })
  network: Network;

  @Prop()
  tokenDetailsPump?: string;

  setPumpTokenDetails?: (pumpTokenDetails: TokenDetailsPump) => string;

  getPumpTokenDetails?: () => TokenDetailsPump;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.methods.getPumpTokenDetails = function (): TokenDetailsPump {
  return JSON.parse(this.tokenDetailsPump);
};

TokenSchema.methods.setPumpTokenDetails = function (
  pumpTokenDetail: TokenDetailsPump,
): string {
  return (this.tokenDetailsPump = JSON.stringify(pumpTokenDetail));
};
