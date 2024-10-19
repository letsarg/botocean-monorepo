import { Injectable } from '@nestjs/common';

@Injectable()
export class AxenodeService {
  getHello(): string {
    return 'Hello World!';
  }
}
