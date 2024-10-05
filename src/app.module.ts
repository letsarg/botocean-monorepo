import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { AppConfigService } from './app-config/app-config.service';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { PromptModule } from './prompt/prompt.module';

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
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.db_connection,
      }),
      inject: [AppConfigService],
    }),
    MongooseModule.forFeature([
      // { name: BotProcess.name, schema: BotProcessSchema },
    ]),
    AppConfigModule,
    DatabaseModule,
    PromptModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule { }
