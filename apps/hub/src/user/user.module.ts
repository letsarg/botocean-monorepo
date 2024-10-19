import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy, AppConfigService],
  imports: [
    JwtModule.register({
      secret: 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ]
})
export class UserModule {}
