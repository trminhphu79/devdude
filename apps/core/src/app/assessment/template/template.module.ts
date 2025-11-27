import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { AssessmentTemplate } from '../../shared/models/assessment-template';
import { AssessmentTemplateQuestion } from '../../shared/models/assessment-template-question';
import { Question } from '../../shared/models/question';
import { Topic } from '../../shared/models/topic';
import { Category } from '../../shared/models/category';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AssessmentTemplate,
      AssessmentTemplateQuestion,
      Question,
      Topic,
      Category,
    ]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
