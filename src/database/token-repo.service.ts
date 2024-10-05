import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDetailsPump, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { Network } from 'src/enum';

@Injectable()
export class TokenRepoService {
  constructor(
    @InjectModel(Token.name)
    private readonly model: Model<TokenDocument>,
  ) { }

  async findByImageCID(cid: string): Promise<TokenDocument> {
    return await this.model.findOne({ cidImage: cid }).exec();
  }

  async findByTokenSymbol(symbol: string, network?: Network): Promise<TokenDocument> {
    if (network) {
      return await this.model.findOne({ symbol: symbol, network: network }).exec();
    } else {
      return await this.model.findOne({ symbol: symbol }).exec();
    }
  }

  async createToken(
    token: Token,
    tokenDetailsPump?: TokenDetailsPump,
  ): Promise<TokenDocument> {
    const createdToken = new this.model(token);

    if (tokenDetailsPump) {
      createdToken.setPumpTokenDetails(tokenDetailsPump);
    }
    return createdToken.save();
  }

  async updateToken(
    id: string,
    token: Token,
  ) {
    return await this.model.findByIdAndUpdate(id, token, { new: true }).exec();
  }
}
