import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { CurrentUser } from './guard/current-user.decorator';
import { User } from './entities/user.entity';
import { Signature } from '@aptos-labs/ts-sdk';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  async login(
    @Body('pubkey') pubkey: string,
    @Body('wallet') wallet: string,
    @Body('signature') signature: string
  ) {
    return this.userService.authenticate(wallet, pubkey, signature);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser() user: User) {
    console.log('alo: ', user)
    return await this.userService.findUserBalance(user.wallet)
  }
}
