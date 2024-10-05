import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TransactionStatus, TransactionType } from 'src/enum';
import { Wallet } from './wallet.schema';
import { Token } from './token.schema';

export type TradeDocument = Trade & Document;

export class TradeDetailsPump {
  vNativeInBondingCurve?: bigint;
  vTokensInBondingCurve?: bigint;
}
@Schema()
export class Trade {
  @Prop({ required: true })
  signature: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  wallet: Wallet;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
  token: Token;

  @Prop()
  timestampFill?: number;

  @Prop({ required: true })
  timestampCreation: number;

  @Prop()
  amountToken?: string;

  @Prop()
  amountNative?: string;

  @Prop()
  price?: string;

  @Prop({ required: true, type: String, enum: TransactionType })
  tradeType: TransactionType;

  @Prop()
  isSold?: boolean;

  @Prop({ required: true })
  isProcessed: boolean;

  @Prop({ required: true, type: String, enum: TransactionStatus })
  status: TransactionStatus;

  @Prop()
  tradeDetailsPump?: string;

  constructor(newTrade: Trade, pumpTradeDetails?: TradeDetailsPump) {
    if (pumpTradeDetails) {
      newTrade.tradeDetailsPump = JSON.stringify(pumpTradeDetails);
    }
    return new Trade(newTrade);
  }

  getPumpTradeDetails?(): TradeDetailsPump {
    return JSON.parse(this.tradeDetailsPump);
  }
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
