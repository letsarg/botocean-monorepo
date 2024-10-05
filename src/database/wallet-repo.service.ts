import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Network, RefundStatus } from 'src/enum';
import { Token } from 'src/database/schemas/token.schema';
import { Wallet, WalletDocument } from 'src/database/schemas/wallet.schema';

@Injectable()
export class WalletRepoService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly model: Model<WalletDocument>,
  ) { }

  async findMasterWallet(network: Network): Promise<WalletDocument | null> {
    return await this.model.findOne({
      network,
      isMaster: true
    }).exec();
  }

  async findDeployerWallet(token: Token, network: Network): Promise<WalletDocument | null> {
    return await this.model.findOne({
      token,
      isDeployer: true,
      network,
    }).exec();
  }

  async findWalletByPublicKey(
    publicKey: string,
  ): Promise<WalletDocument | null> {
    return await this.model.findOne({ publicKey }).exec();
  }

  async findRefundWallets(token: Token): Promise<WalletDocument[]> {
    return await this.model
      .find({ token, isUsed: false, refundStatus: RefundStatus.YES })
      .exec();
  }

  async findAllRefundWallets(token: Token, network: Network): Promise<WalletDocument[]> {
    return await this.model
      .find({
        token,
        isMaster: false,
        network,
      })
      .exec();
  }

  async createWallet(wallet: Wallet): Promise<WalletDocument> {
    const createdWallet = new this.model(wallet);
    return await createdWallet.save();
  }

  async createWallets(wallets: Wallet[]): Promise<WalletDocument[]> {
    return await this.model.insertMany(wallets, { ordered: true });
  }

  async updateWallet(
    id: string,
    wallet: Wallet,
  ): Promise<WalletDocument | null> {
    return await this.model.findByIdAndUpdate(id, wallet, { new: true }).exec();
  }

  async updateWallets(wallets: WalletDocument[]): Promise<void> {
    for (const wallet of wallets) {
      await this.updateWallet(wallet.id, wallet);
    }
  }
}
