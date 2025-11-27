import { Global, Module } from '@nestjs/common';
import { AttemptModule } from './attempt/attempt.module';
import { TemplateModule } from './template/template.module';

@Global()
@Module({
  imports: [AttemptModule, TemplateModule],
  exports: [AttemptModule, TemplateModule],
})
export class AssessmentModule {}
