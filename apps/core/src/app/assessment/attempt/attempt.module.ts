import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { Attempt } from '../../shared/models/attempt';
import { AttemptAnswer } from '../../shared/models/attempt-answer';
import { Account } from '../../shared/models/account';
import { AssessmentTemplate } from '../../shared/models/assessment-template';
import { Question } from '../../shared/models/question';
import { AnswerOption } from '../../shared/models/answer-option';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Attempt,
      AttemptAnswer,
      Account,
      AssessmentTemplate,
      Question,
      AnswerOption,
    ]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService],
  exports: [AttemptService],
})
export class AttemptModule {}
