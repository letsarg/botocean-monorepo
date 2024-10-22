import { NestFactory } from '@nestjs/core';
import { AccountingBundleModule } from './accounting_bundle.module';

async function bootstrap() {
  const app = await NestFactory.create(AccountingBundleModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
