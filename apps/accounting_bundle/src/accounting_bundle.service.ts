import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountingBundleService {
  getHello(): string {
    return 'Hello World!';
  }
}
