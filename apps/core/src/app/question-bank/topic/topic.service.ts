import { Injectable, NotFoundException } from '@nestjs/common';
import { Topic } from '../../shared/models/topic';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTopicDto, UpdateTopicDto } from '@devdude/common';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic)
    private topicModel: typeof Topic
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicModel.create(createTopicDto as any);
  }

  async findAll(): Promise<Topic[]> {
    return this.topicModel.findAll();
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findByPk(id);
    if (!topic) {
      throw new NotFoundException(`Topic with id ${id} not found`);
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const [affectedCount, affectedRows] = await this.topicModel.update(
      updateTopicDto,
      {
        where: { id },
        returning: true,
      }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Topic with id ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.topicModel.destroy({ where: { id } });
    if (deleted === 0) {
      throw new NotFoundException(`Topic with id ${id} not found`);
    }
  }
}
