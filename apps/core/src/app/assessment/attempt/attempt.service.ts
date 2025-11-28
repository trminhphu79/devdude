import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attempt } from '../../shared/models/attempt';
import { AttemptAnswer } from '../../shared/models/attempt-answer';
import { Account } from '../../shared/models/account';
import {
  CreateAttemptDto,
  SubmitAnswersDto,
  UpdateAttemptDto,
} from '@devdue/common';
import { AssessmentTemplate } from '../../shared/models/assessment-template';

@Injectable()
export class AttemptService {
  constructor(
    @InjectModel(Attempt)
    private attemptModel: typeof Attempt,
    @InjectModel(AttemptAnswer)
    private attemptAnswerModel: typeof AttemptAnswer,
    @InjectModel(Account)
    private accountModel: typeof Account,
    @InjectModel(AssessmentTemplate)
    private templateModel: typeof AssessmentTemplate
  ) {}

  async create(createAttemptDto: CreateAttemptDto): Promise<Attempt> {
    const { email, fullName, templateId } = createAttemptDto;

    // Check if template exists
    const template = await this.templateModel.findByPk(templateId);
    if (!template) {
      throw new NotFoundException(
        `Assessment Template with ID ${templateId} not found`
      );
    }

    // Find or create account
    let account = await this.accountModel.findOne({ where: { email } });
    if (!account) {
      account = await this.accountModel.create({
        email,
        fullName,
        isActive: true,
      });
    }

    // Create attempt
    return this.attemptModel.create({
      accountId: account.id,
      templateId,
      startedAt: new Date(),
    });
  }

  async findAll(): Promise<Attempt[]> {
    return this.attemptModel.findAll({
      include: [Account, AssessmentTemplate],
    });
  }

  async findOne(id: string): Promise<Attempt> {
    const attempt = await this.attemptModel.findByPk(id, {
      include: [
        Account,
        AssessmentTemplate,
        {
          model: AttemptAnswer,
          as: 'answers',
        },
      ],
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${id} not found`);
    }

    return attempt;
  }

  async update(
    id: string,
    updateAttemptDto: UpdateAttemptDto
  ): Promise<Attempt> {
    const attempt = await this.findOne(id);
    return attempt.update(updateAttemptDto);
  }

  async remove(id: string): Promise<void> {
    const attempt = await this.findOne(id);
    await attempt.destroy();
  }

  async submitAnswers(
    attemptId: string,
    submitAnswersDto: SubmitAnswersDto
  ): Promise<AttemptAnswer[]> {
    const attempt = await this.attemptModel.findByPk(attemptId);
    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${attemptId} not found`);
    }

    const answersData = submitAnswersDto.answers.map((answer) => ({
      attemptId,
      ...answer,
    }));

    return this.attemptAnswerModel.bulkCreate(answersData);
  }
}
