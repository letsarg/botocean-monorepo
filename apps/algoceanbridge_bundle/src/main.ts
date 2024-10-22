import { NestFactory } from '@nestjs/core';
import { AlgoceanbridgeBundleModule } from './algoceanbridge_bundle.module';

async function bootstrap() {
  const app = await NestFactory.create(AlgoceanbridgeBundleModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
