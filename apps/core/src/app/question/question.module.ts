import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question } from '../shared/models/question';
import { AnswerOption } from '../shared/models/answer-option';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Question, AnswerOption])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
