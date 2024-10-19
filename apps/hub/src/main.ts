import { NestFactory } from '@nestjs/core';
import { HubModule } from './hub.module';

async function bootstrap() {
  const app = await NestFactory.create(HubModule);
  await app.listen(3000);
}
bootstrap();
