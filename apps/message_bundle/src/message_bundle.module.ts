import { Module } from '@nestjs/common';
import { MessageBundleService } from './message_bundle.service';
import { QuicModule, QuicServerService } from '@app/core';

@Module({
  imports: [QuicModule],
  providers: [QuicServerService, MessageBundleService],
})
export class MessageBundleModule { }
