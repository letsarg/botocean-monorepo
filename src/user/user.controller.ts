import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body('wallet') wallet: string, @Body('signature') signature: string) {
    return this.userService.authenticate(wallet, signature);
  }

}
