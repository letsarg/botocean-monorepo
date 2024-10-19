import { ReceivableBundle, SendableBundle } from '@app/core/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageBundleService implements
  SendableBundle,
  ReceivableBundle {
  getHello(): string {
    return 'Hello World!';
  }

  async send() {
    
  }

  async receive() {

  }
}
