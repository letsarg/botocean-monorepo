import { NestFactory } from '@nestjs/core';
import { MessageBundleModule } from './message_bundle.module';

async function bootstrap() {
  const app = await NestFactory.create(MessageBundleModule);
  await app.listen(3000);
}
bootstrap();
