import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from './schemas/trade.schema';
import { TransactionStatus, TransactionType } from 'src/enum';

@Injectable()
export class TradeRepoService {
  constructor(
    @InjectModel(Trade.name)
    private readonly model: Model<TradeDocument>,
  ) {}
  async findUnprocessedTransactions(token: Token): Promise<TradeDocument[]> {
    return await this.model
      .find({ isProcessed: false, status: TransactionStatus.PENDING, token })
      .populate('wallet')
      .exec();
  }

  async findTransactionByWalletTradeTypeTokenId(
    wallet: string,
    tradeType: string,
    token: Token,
  ) {
    return await this.model
      .findOne({
        wallet,
        tradeType,
        token,
      })
      .populate('wallet')
      .exec();
  }

  async findBuysByToken(token: Token): Promise<TradeDocument[]> {
    return await this.model
      .find({
        tradeType: TransactionType.BUY,
        token,
      })
      .populate('wallet')
      .exec();
  }

  async findBuysByTokenAndSoldStatus(
    token: Token,
    isSold: boolean,
  ): Promise<TradeDocument[]> {
    return await this.model
      .find({
        tradeType: TransactionType.BUY,
        token,
        isSold,
      })
      .populate('wallet')
      .exec();
  }

  async createTrades(trades: Trade[]): Promise<void> {
    await this.model.insertMany(trades);
  }

  async updateTrade(id: string, trade: Trade): Promise<void> {
    await this.model.findByIdAndUpdate(id, trade).exec();
  }
}
