import { Global, Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from '../../shared/models/topic';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
