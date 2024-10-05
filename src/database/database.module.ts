import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './schemas/trade.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { BotProcess, BotProcessSchema } from './schemas/bot-process.schema';
import { TokenRepoService } from './token-repo.service';
import { BotProcessRepoService } from './bot-process-repo.service';
import { TradeRepoService } from './trade-repo.service';
import { WalletRepoService } from './wallet-repo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: TradeSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: BotProcess.name, schema: BotProcessSchema },
    ]),
  ],
  providers: [
    TokenRepoService,
    BotProcessRepoService,
    TradeRepoService,
    WalletRepoService,
  ],
  exports: [
    TokenRepoService,
    BotProcessRepoService,
    TradeRepoService,
    WalletRepoService,
  ],
})
export class DatabaseModule {}
