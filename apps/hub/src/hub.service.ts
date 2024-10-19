import { Injectable } from '@nestjs/common';

@Injectable()
export class HubService {
  getHello(): string {
    return 'Hello World!';
  }
}
