import { NestFactory } from '@nestjs/core';
import { SeanodeModule } from './seanode.module';

async function bootstrap() {
  const app = await NestFactory.create(SeanodeModule);
  await app.listen(3000);
}
bootstrap();
