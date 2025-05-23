import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { AppConfigService } from './app-config/app-config.service';
import { AppConfigModule } from './app-config/app-config.module';
// import { ProviderModule } from './provider/provider.module';
// import { HubModule } from './hub/hub.module';
// import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          const file = fs.readFileSync('config.yml', 'utf8');
          return yaml.parse(file);
        },
      ],
      isGlobal: true,
    }),
    AppConfigModule,
    // ProviderModule,
    // HubModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule { }
