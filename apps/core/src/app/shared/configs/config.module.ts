import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
