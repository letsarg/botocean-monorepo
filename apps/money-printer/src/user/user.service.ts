// src/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { ethers } from 'ethers';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Ed25519PublicKey, Ed25519Signature, HexInput, Signature } from "@aptos-labs/ts-sdk";

@Injectable()
export class UserService {
  private redisClient: Redis;

  constructor(private readonly jwtService: JwtService, readonly appConfig: AppConfigService) {
    this.redisClient = new Redis({
      host: appConfig.redis_host,
      port: appConfig.redis_port,
    });
  }

  private message = 'Sign this message to log in';

  async findUserByWallet(wallet: string): Promise<User | null> {
    const user = await this.redisClient.get(`user:${wallet}`);
    return user ? JSON.parse(user) : null;
  }

  async findUserBalance(wallet: string): Promise<string> {
    const res = await this.redisClient.get(`balance:${wallet}`)
    return res
  }

  async createUser(wallet: string, signature: string): Promise<User> {
    const id = crypto.randomBytes(8).toString('hex');
    const user = new User(id, wallet, signature);
    await this.redisClient.set(`user:${wallet}`, JSON.stringify(user));
    await this.redisClient.set(`balance:${wallet}`, 0)
    return user;
  }

  async login(wallet: string, signature: string): Promise<string> {
    let user = await this.findUserByWallet(wallet);
    if (!user) {
      user = await this.createUser(wallet, signature);
    }

    const payload = { user, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async authenticate(wallet: string, pubkey: string, signature: string): Promise<{ token?: string }> {
    if (await this.verifySignature(this.message, pubkey, signature)) {
      const token = await this.login(wallet, signature.toString());
      return { token };
    }

    throw new BadRequestException('Invalid signature')
  }

  async verifySignature(
    message: string,
    publicKey: string,
    signature: string,
  ): Promise<boolean> {
    // TODO fix this verify
    // return new Ed25519PublicKey(publicKey)
    //   .verifySignature({
    //     message: (new TextEncoder()).encode(message),
    //     signature: (new TextEncoder()).encode(signature) as any,
    //   });
    return true;
  }

  async isSignatureValid(message, address, signature) {
    try {
      new Ed25519PublicKey(address).verifySignature({
        message: message,
        signature: signature,
      });
      const signerAddr = await ethers.verifyMessage(message, signature);
      if (signerAddr !== address) {
        return false;
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
