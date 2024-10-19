import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Network, RefundStatus } from 'src/enum';
import { Token } from './token.schema';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  privateKey: string;

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  balanceToken?: bigint;

  @Prop({ required: true, type: String, enum: Network })
  network: Network;

  @Prop({ required: true })
  isDeployer: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  funder?: Wallet;

  @Prop()
  fundSignature?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
  token?: Token;

  @Prop({ required: true })
  isMaster?: boolean;

  @Prop()
  isFunded?: boolean;

  @Prop({ type: String, enum: RefundStatus })
  refundStatus?: RefundStatus;

  @Prop()
  isUsed?: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
