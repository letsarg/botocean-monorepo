import { Module } from '@nestjs/common';
import { MessageBundleService } from './message_bundle.service';
import { QuicModule, QuicService } from '@app/core';

@Module({
  imports: [QuicModule],
  providers: [QuicService, MessageBundleService],
})
export class MessageBundleModule { }
