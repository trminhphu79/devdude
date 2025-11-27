import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';
import { AttemptModule } from './attempt/attempt.module';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from './shared/models/topic';
import { Category } from './shared/models/category';
import { AssessmentTemplate } from './shared/models/assessment-template';
import { Question } from './shared/models/question';
import { AnswerOption } from './shared/models/answer-option';
import { AssessmentTemplateQuestion } from './shared/models/assessment-template-question';
import { User } from './shared/models/user';
import { Attempt } from './shared/models/attempt';
import { AttemptAnswer } from './shared/models/attempt-answer';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    TopicModule,
    CategoryModule,
    QuestionModule,
    AttemptModule,
    UserModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'root',
      password: process.env.POSTGRES_PASSWORD || 'root',
      database: process.env.POSTGRES_DB || 'devdude',
      models: [
        Topic,
        Category,
        AssessmentTemplate,
        Question,
        AnswerOption,
        AssessmentTemplateQuestion,
        User,
        Attempt,
        AttemptAnswer,
      ],
      synchronize: true,
      autoLoadModels: true,
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
