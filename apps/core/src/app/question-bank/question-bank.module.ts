import { Global, Module } from '@nestjs/common';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';
import { CategoryModule } from './category/category.module';

@Global()
@Module({
  imports: [TopicModule, QuestionModule, CategoryModule],
  exports: [TopicModule, QuestionModule, CategoryModule],
})
export class QuestionBankModule {}
