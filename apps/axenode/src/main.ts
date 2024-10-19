import { NestFactory } from '@nestjs/core';
import { AxenodeModule } from './axenode.module';

async function bootstrap() {
  const app = await NestFactory.create(AxenodeModule);
  await app.listen(3000);
}
bootstrap();
