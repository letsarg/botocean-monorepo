import { Injectable } from '@nestjs/common';

@Injectable()
export class SeanodeService {
  getHello(): string {
    return 'Hello World!';
  }
}
