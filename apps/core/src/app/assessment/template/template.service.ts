import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssessmentTemplate } from '../../shared/models/assessment-template';
import { AssessmentTemplateQuestion } from '../../shared/models/assessment-template-question';
import { Question } from '../../shared/models/question';
import { Topic } from '../../shared/models/topic';
import { Category } from '../../shared/models/category';
import {
  CreateAssessmentTemplateDto,
  UpdateAssessmentTemplateDto,
  AddQuestionToTemplateDto,
  GenerateTemplateQuestionsDto,
} from '@devdue/common';
import { Op } from 'sequelize';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(AssessmentTemplate)
    private assessmentTemplateModel: typeof AssessmentTemplate,
    @InjectModel(AssessmentTemplateQuestion)
    private templateQuestionModel: typeof AssessmentTemplateQuestion,
    @InjectModel(Question)
    private questionModel: typeof Question,
    @InjectModel(Topic)
    private topicModel: typeof Topic,
    @InjectModel(Category)
    private categoryModel: typeof Category
  ) {}

  async create(
    createTemplateDto: CreateAssessmentTemplateDto
  ): Promise<AssessmentTemplate> {
    // Verify topic exists
    const topic = await this.topicModel.findByPk(createTemplateDto.topicId);
    if (!topic) {
      throw new NotFoundException(
        `Topic with ID ${createTemplateDto.topicId} not found`
      );
    }

    return this.assessmentTemplateModel.create(createTemplateDto as any);
  }

  async findAll(): Promise<AssessmentTemplate[]> {
    return this.assessmentTemplateModel.findAll({
      include: [
        {
          model: Topic,
          attributes: ['id', 'name', 'description'],
        },
      ],
    });
  }

  async findOne(id: string): Promise<AssessmentTemplate> {
    const template = await this.assessmentTemplateModel.findByPk(id, {
      include: [
        {
          model: Topic,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: AssessmentTemplateQuestion,
          include: [
            {
              model: Question,
              attributes: [
                'id',
                'content',
                'type',
                'difficultyLevel',
                'weight',
                'timeLimitSec',
              ],
            },
          ],
        },
      ],
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async update(
    id: string,
    updateTemplateDto: UpdateAssessmentTemplateDto
  ): Promise<AssessmentTemplate> {
    // If topicId is being updated, verify it exists
    if (updateTemplateDto.topicId) {
      const topic = await this.topicModel.findByPk(updateTemplateDto.topicId);
      if (!topic) {
        throw new NotFoundException(
          `Topic with ID ${updateTemplateDto.topicId} not found`
        );
      }
    }

    const [affectedCount, affectedRows] =
      await this.assessmentTemplateModel.update(updateTemplateDto, {
        where: { id },
        returning: true,
      });

    if (affectedCount === 0) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.assessmentTemplateModel.destroy({
      where: { id },
    });

    if (deleted === 0) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
  }

  async addQuestion(
    templateId: string,
    addQuestionDto: AddQuestionToTemplateDto
  ): Promise<AssessmentTemplateQuestion> {
    // Verify template exists
    const template = await this.assessmentTemplateModel.findByPk(templateId);
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // Verify question exists
    const question = await this.questionModel.findByPk(
      addQuestionDto.questionId
    );
    if (!question) {
      throw new NotFoundException(
        `Question with ID ${addQuestionDto.questionId} not found`
      );
    }

    // Check if question already exists in template
    const existingLink = await this.templateQuestionModel.findOne({
      where: {
        templateId,
        questionId: addQuestionDto.questionId,
      },
    });

    if (existingLink) {
      throw new BadRequestException(
        `Question ${addQuestionDto.questionId} already exists in template ${templateId}`
      );
    }

    return this.templateQuestionModel.create({
      templateId,
      questionId: addQuestionDto.questionId,
      orderIndex: addQuestionDto.orderIndex,
    } as any);
  }

  async removeQuestion(templateId: string, questionId: string): Promise<void> {
    const deleted = await this.templateQuestionModel.destroy({
      where: {
        templateId,
        questionId,
      },
    });

    if (deleted === 0) {
      throw new NotFoundException(
        `Question ${questionId} not found in template ${templateId}`
      );
    }
  }

  async getTemplateQuestions(
    templateId: string
  ): Promise<AssessmentTemplateQuestion[]> {
    const template = await this.assessmentTemplateModel.findByPk(templateId);
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    return this.templateQuestionModel.findAll({
      where: { templateId },
      include: [
        {
          model: Question,
          attributes: [
            'id',
            'content',
            'type',
            'difficultyLevel',
            'weight',
            'timeLimitSec',
          ],
        },
      ],
      order: [['orderIndex', 'ASC']],
    });
  }

  /**
   * Generate and assign questions to a template based on difficulty distribution
   * Ensures the total points always equal 100 based on weight calculation
   */
  async generateQuestionsForTemplate(
    templateId: string,
    generateDto: GenerateTemplateQuestionsDto
  ): Promise<{ added: number; message: string }> {
    // Verify template exists and get its difficulty distribution
    const template = await this.assessmentTemplateModel.findByPk(templateId);
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    // Verify topic exists
    const topic = await this.topicModel.findByPk(generateDto.topicId);
    if (!topic) {
      throw new NotFoundException(
        `Topic with ID ${generateDto.topicId} not found`
      );
    }

    // Verify all categories exist and belong to the topic
    const categories = await this.categoryModel.findAll({
      where: {
        id: { [Op.in]: generateDto.categoryIds },
        topicId: generateDto.topicId,
      },
    });

    if (categories.length !== generateDto.categoryIds.length) {
      throw new BadRequestException(
        'One or more categories not found or do not belong to the specified topic'
      );
    }

    const difficultyDistribution = template.difficultyDistribution as {
      Fresher?: number;
      Junior?: number;
      Mid?: number;
      MidLate?: number;
      Senior?: number;
    };

    // Validate that difficulty distribution totals to 100 points
    const totalPoints = this.calculateTotalPoints(difficultyDistribution);
    if (totalPoints !== 100) {
      throw new BadRequestException(
        `Difficulty distribution must total to 100 points. Current total: ${totalPoints}`
      );
    }

    // Clear existing questions from template
    await this.templateQuestionModel.destroy({
      where: { templateId },
    });

    let orderIndex = 0;
    const addedQuestions: string[] = [];

    // Fetch ALL questions from specified categories
    const allQuestions = await this.questionModel.findAll({
      where: {
        categoryId: { [Op.in]: generateDto.categoryIds },
      },
      order: [['createdAt', 'DESC']],
    });

    // Group questions by difficulty level
    const questionsByDifficulty: {
      [key: string]: typeof allQuestions;
    } = {
      Fresher: [],
      Junior: [],
      Mid: [],
      MidLate: [],
      Senior: [],
    };

    for (const question of allQuestions) {
      const difficulty = question.difficultyLevel;
      if (questionsByDifficulty[difficulty]) {
        questionsByDifficulty[difficulty].push(question);
      }
    }

    // Shuffle questions in each difficulty group for randomization
    for (const difficulty in questionsByDifficulty) {
      questionsByDifficulty[difficulty] = this.shuffleArray(
        questionsByDifficulty[difficulty]
      );
    }

    // For each difficulty level, select required count of questions
    for (const [difficulty, count] of Object.entries(difficultyDistribution)) {
      if (!count || count === 0) continue;

      const availableQuestions = questionsByDifficulty[difficulty] || [];

      if (availableQuestions.length < count) {
        throw new BadRequestException(
          `Not enough questions found for difficulty level ${difficulty}. ` +
            `Required: ${count}, Available: ${availableQuestions.length}`
        );
      }

      // Select the required number of questions (already shuffled)
      const selectedQuestions = availableQuestions.slice(0, count);

      // Add questions to template
      for (const question of selectedQuestions) {
        await this.templateQuestionModel.create({
          templateId,
          questionId: question.id,
          orderIndex: orderIndex++,
        } as any);
        addedQuestions.push(question.id);
      }
    }

    return {
      added: addedQuestions.length,
      message: `Successfully generated ${addedQuestions.length} questions for template`,
    };
  }

  /**
   * Shuffle array using Fisher-Yates algorithm for random distribution
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculate total points based on difficulty distribution
   * Weight mapping: Fresher=1, Junior=2, Mid=3, MidLate=4, Senior=5
   */
  private calculateTotalPoints(difficultyDistribution: {
    Fresher?: number;
    Junior?: number;
    Mid?: number;
    MidLate?: number;
    Senior?: number;
  }): number {
    const weightMap = {
      Fresher: 1,
      Junior: 2,
      Mid: 3,
      MidLate: 4,
      Senior: 5,
    };

    let total = 0;
    for (const [difficulty, count] of Object.entries(difficultyDistribution)) {
      if (count) {
        const weight = weightMap[difficulty as keyof typeof weightMap] || 0;
        total += count * weight;
      }
    }

    return total;
  }
}
