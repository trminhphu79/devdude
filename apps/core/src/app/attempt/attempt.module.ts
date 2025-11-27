import { Global, Module } from '@nestjs/common';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';

@Global()
@Module({
  controllers: [AttemptController],
  providers: [AttemptService],
})
export class AttemptModule {}
