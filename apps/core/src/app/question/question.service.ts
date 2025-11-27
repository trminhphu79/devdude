import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from '../shared/models/question';
import { AnswerOption } from '../shared/models/answer-option';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question,
    @InjectModel(AnswerOption)
    private answerOptionModel: typeof AnswerOption,
    private sequelize: Sequelize
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const transaction = await this.sequelize.transaction();

    try {
      const { options, ...questionData } = createQuestionDto;

      // Create the question
      const question = await this.questionModel.create(questionData as any, {
        transaction,
      });

      // Create answer options
      if (options && options.length > 0) {
        await this.answerOptionModel.bulkCreate(
          options.map((option) => ({
            ...option,
            questionId: question.id,
          })) as any,
          { transaction }
        );
      }

      await transaction.commit();

      // Fetch the complete question with options
      return this.findOne(question.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.findAll({
      include: [AnswerOption],
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findByPk(id, {
      include: [AnswerOption],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto
  ): Promise<Question> {
    const transaction = await this.sequelize.transaction();

    try {
      const { options, ...questionData } = updateQuestionDto;

      // Update the question
      const [affectedCount] = await this.questionModel.update(questionData, {
        where: { id },
        transaction,
      });

      if (affectedCount === 0) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }

      // If options are provided, replace them
      if (options) {
        // Delete existing options
        await this.answerOptionModel.destroy({
          where: { questionId: id },
          transaction,
        });

        // Create new options
        if (options.length > 0) {
          await this.answerOptionModel.bulkCreate(
            options.map((option) => ({
              ...option,
              questionId: id,
            })) as any,
            { transaction }
          );
        }
      }

      await transaction.commit();

      return this.findOne(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const transaction = await this.sequelize.transaction();

    try {
      // Delete answer options first (cascade)
      await this.answerOptionModel.destroy({
        where: { questionId: id },
        transaction,
      });

      // Delete the question
      const deletedCount = await this.questionModel.destroy({
        where: { id },
        transaction,
      });

      if (deletedCount === 0) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }

      await transaction.commit();

      return { deleted: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
