// src/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import Redis from 'ioredis';
import { ethers } from 'ethers';

@Injectable()
export class UserService {
  private redisClient: Redis;

  constructor(private readonly jwtService: JwtService) {
    this.redisClient = new Redis();
  }
    
  private message = 'Sign this message to log in';

  async findUserByWallet(wallet: string): Promise<User | null> {
    const user = await this.redisClient.get(`user:${wallet}`);
    return user ? JSON.parse(user) : null;
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


  async authenticate(wallet: string, providedSignature: string): Promise<{ token?: string }> {

    if (await this.isSignatureValid(this.message, wallet, providedSignature)) {
      const token = await this.login(wallet, providedSignature);
      return { token };
    }

    throw new BadRequestException('Invalid signature')
  }

  async isSignatureValid(message, address, signature) {
    try {
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
