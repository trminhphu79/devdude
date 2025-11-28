import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssessmentModule } from './assessment/assessment.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { Account } from './shared/models/account';
import { AnswerOption } from './shared/models/answer-option';
import { AssessmentTemplate } from './shared/models/assessment-template';
import { AssessmentTemplateQuestion } from './shared/models/assessment-template-question';
import { Attempt } from './shared/models/attempt';
import { AttemptAnswer } from './shared/models/attempt-answer';
import { Category } from './shared/models/category';
import { Question } from './shared/models/question';
import { Topic } from './shared/models/topic';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [
    QuestionBankModule,
    AssessmentModule,
    AuthModule,
    AdminModule,
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
        Account,
        Attempt,
        AttemptAnswer,
      ],
      synchronize: true,
      autoLoadModels: true,
      logging: false,
    }),
    EvaluationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
