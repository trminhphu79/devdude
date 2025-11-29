import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TemplateService } from './template.service';
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

const mockAssessmentTemplateModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockTemplateQuestionModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
};

const mockQuestionModel = {
  findByPk: jest.fn(),
  findAll: jest.fn(),
};

const mockTopicModel = {
  findByPk: jest.fn(),
};

const mockCategoryModel = {
  findAll: jest.fn(),
};

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: getModelToken(AssessmentTemplate),
          useValue: mockAssessmentTemplateModel,
        },
        {
          provide: getModelToken(AssessmentTemplateQuestion),
          useValue: mockTemplateQuestionModel,
        },
        {
          provide: getModelToken(Question),
          useValue: mockQuestionModel,
        },
        {
          provide: getModelToken(Topic),
          useValue: mockTopicModel,
        },
        {
          provide: getModelToken(Category),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a template', async () => {
      const dto: CreateAssessmentTemplateDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Angular Assessment',
        description: 'Test assessment',
        totalQuestions: 45,
        difficultyDistribution: {
          Fresher: 12,
          Junior: 21,
          Mid: 6,
          MidLate: 2,
          Senior: 4,
        },
      };
      const expectedResult = { id: '1', ...dto };
      mockTopicModel.findByPk.mockResolvedValue({ id: dto.topicId });
      mockAssessmentTemplateModel.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(result).toEqual(expectedResult);
      expect(mockTopicModel.findByPk).toHaveBeenCalledWith(dto.topicId);
      expect(mockAssessmentTemplateModel.create).toHaveBeenCalledWith(dto);
    });

    it('should throw NotFoundException if topic not found', async () => {
      const dto: CreateAssessmentTemplateDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Angular Assessment',
        description: 'Test assessment',
        totalQuestions: 45,
        difficultyDistribution: { Fresher: 12 },
      };
      mockTopicModel.findByPk.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow(
        `Topic with ID ${dto.topicId} not found`
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of templates', async () => {
      const expectedResult = [
        {
          id: '1',
          topicId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Template 1',
          description: 'Description 1',
          totalQuestions: 45,
          difficultyDistribution: { Fresher: 12 },
        },
        {
          id: '2',
          topicId: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Template 2',
          description: 'Description 2',
          totalQuestions: 30,
          difficultyDistribution: { Junior: 10 },
        },
      ];
      mockAssessmentTemplateModel.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockAssessmentTemplateModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Topic,
            attributes: ['id', 'name', 'description'],
          },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a template by id', async () => {
      const templateId = '1';
      const expectedResult = {
        id: templateId,
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        description: 'Test Description',
        totalQuestions: 45,
        difficultyDistribution: { Fresher: 12 },
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue(expectedResult);

      const result = await service.findOne(templateId);

      expect(result).toEqual(expectedResult);
      expect(mockAssessmentTemplateModel.findByPk).toHaveBeenCalledWith(
        templateId,
        {
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
        }
      );
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';
      mockAssessmentTemplateModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(templateId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne(templateId)).rejects.toThrow(
        `Template with ID ${templateId} not found`
      );
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const templateId = '1';
      const dto: UpdateAssessmentTemplateDto = {
        name: 'Updated Template',
        description: 'Updated Description',
      };
      const updatedTemplate = {
        id: templateId,
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        ...dto,
      };
      mockAssessmentTemplateModel.update.mockResolvedValue([
        1,
        [updatedTemplate],
      ]);

      const result = await service.update(templateId, dto);

      expect(result).toEqual(updatedTemplate);
      expect(mockAssessmentTemplateModel.update).toHaveBeenCalledWith(dto, {
        where: { id: templateId },
        returning: true,
      });
    });

    it('should verify topic exists when updating topicId', async () => {
      const templateId = '1';
      const dto: UpdateAssessmentTemplateDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
      };
      const updatedTemplate = { id: templateId, ...dto };
      mockTopicModel.findByPk.mockResolvedValue({ id: dto.topicId });
      mockAssessmentTemplateModel.update.mockResolvedValue([
        1,
        [updatedTemplate],
      ]);

      const result = await service.update(templateId, dto);

      expect(result).toEqual(updatedTemplate);
      expect(mockTopicModel.findByPk).toHaveBeenCalledWith(dto.topicId);
    });

    it('should throw NotFoundException if topic not found when updating', async () => {
      const templateId = '1';
      const dto: UpdateAssessmentTemplateDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
      };
      mockTopicModel.findByPk.mockResolvedValue(null);

      await expect(service.update(templateId, dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.update(templateId, dto)).rejects.toThrow(
        `Topic with ID ${dto.topicId} not found`
      );
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';
      const dto: UpdateAssessmentTemplateDto = {
        name: 'Updated Template',
      };
      mockAssessmentTemplateModel.update.mockResolvedValue([0, []]);

      await expect(service.update(templateId, dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.update(templateId, dto)).rejects.toThrow(
        `Template with ID ${templateId} not found`
      );
    });
  });

  describe('remove', () => {
    it('should remove a template', async () => {
      const templateId = '1';
      mockAssessmentTemplateModel.destroy.mockResolvedValue(1);

      await service.remove(templateId);

      expect(mockAssessmentTemplateModel.destroy).toHaveBeenCalledWith({
        where: { id: templateId },
      });
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';
      mockAssessmentTemplateModel.destroy.mockResolvedValue(0);

      await expect(service.remove(templateId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.remove(templateId)).rejects.toThrow(
        `Template with ID ${templateId} not found`
      );
    });
  });

  describe('addQuestion', () => {
    it('should add a question to template', async () => {
      const templateId = '1';
      const dto: AddQuestionToTemplateDto = {
        questionId: '123e4567-e89b-12d3-a456-426614174000',
        orderIndex: 1,
      };
      const expectedResult = {
        id: '1',
        templateId,
        questionId: dto.questionId,
        orderIndex: dto.orderIndex,
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue({
        id: templateId,
      });
      mockQuestionModel.findByPk.mockResolvedValue({ id: dto.questionId });
      mockTemplateQuestionModel.findOne.mockResolvedValue(null);
      mockTemplateQuestionModel.create.mockResolvedValue(expectedResult);

      const result = await service.addQuestion(templateId, dto);

      expect(result).toEqual(expectedResult);
      expect(mockTemplateQuestionModel.create).toHaveBeenCalledWith({
        templateId,
        questionId: dto.questionId,
        orderIndex: dto.orderIndex,
      });
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';
      const dto: AddQuestionToTemplateDto = {
        questionId: '123e4567-e89b-12d3-a456-426614174000',
        orderIndex: 1,
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue(null);

      await expect(service.addQuestion(templateId, dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.addQuestion(templateId, dto)).rejects.toThrow(
        `Template with ID ${templateId} not found`
      );
    });

    it('should throw NotFoundException if question not found', async () => {
      const templateId = '1';
      const dto: AddQuestionToTemplateDto = {
        questionId: '123e4567-e89b-12d3-a456-426614174000',
        orderIndex: 1,
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue({
        id: templateId,
      });
      mockQuestionModel.findByPk.mockResolvedValue(null);

      await expect(service.addQuestion(templateId, dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.addQuestion(templateId, dto)).rejects.toThrow(
        `Question with ID ${dto.questionId} not found`
      );
    });

    it('should throw BadRequestException if question already exists in template', async () => {
      const templateId = '1';
      const dto: AddQuestionToTemplateDto = {
        questionId: '123e4567-e89b-12d3-a456-426614174000',
        orderIndex: 1,
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue({
        id: templateId,
      });
      mockQuestionModel.findByPk.mockResolvedValue({ id: dto.questionId });
      mockTemplateQuestionModel.findOne.mockResolvedValue({
        id: '1',
        templateId,
        questionId: dto.questionId,
      });

      await expect(service.addQuestion(templateId, dto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.addQuestion(templateId, dto)).rejects.toThrow(
        `Question ${dto.questionId} already exists in template ${templateId}`
      );
    });
  });

  describe('removeQuestion', () => {
    it('should remove a question from template', async () => {
      const templateId = '1';
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      mockTemplateQuestionModel.destroy.mockResolvedValue(1);

      await service.removeQuestion(templateId, questionId);

      expect(mockTemplateQuestionModel.destroy).toHaveBeenCalledWith({
        where: {
          templateId,
          questionId,
        },
      });
    });

    it('should throw NotFoundException if question not found in template', async () => {
      const templateId = '1';
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      mockTemplateQuestionModel.destroy.mockResolvedValue(0);

      await expect(
        service.removeQuestion(templateId, questionId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.removeQuestion(templateId, questionId)
      ).rejects.toThrow(
        `Question ${questionId} not found in template ${templateId}`
      );
    });
  });

  describe('getTemplateQuestions', () => {
    it('should return all questions in template', async () => {
      const templateId = '1';
      const expectedResult = [
        {
          id: '1',
          templateId,
          questionId: '123e4567-e89b-12d3-a456-426614174000',
          orderIndex: 1,
        },
        {
          id: '2',
          templateId,
          questionId: '123e4567-e89b-12d3-a456-426614174001',
          orderIndex: 2,
        },
      ];
      mockAssessmentTemplateModel.findByPk.mockResolvedValue({
        id: templateId,
      });
      mockTemplateQuestionModel.findAll.mockResolvedValue(expectedResult);

      const result = await service.getTemplateQuestions(templateId);

      expect(result).toEqual(expectedResult);
      expect(mockTemplateQuestionModel.findAll).toHaveBeenCalledWith({
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
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';
      mockAssessmentTemplateModel.findByPk.mockResolvedValue(null);

      await expect(service.getTemplateQuestions(templateId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getTemplateQuestions(templateId)).rejects.toThrow(
        `Template with ID ${templateId} not found`
      );
    });
  });

  describe('generateQuestionsForTemplate', () => {
    it('should generate and assign questions to template', async () => {
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: [
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002',
        ],
      };
      const template = {
        id: templateId,
        difficultyDistribution: {
          Fresher: 12,
          Junior: 21,
          Mid: 6,
          MidLate: 2,
          Senior: 4,
        },
      };

      // Create mock questions for all difficulty levels
      const mockAllQuestions = [
        ...Array(15)
          .fill(null)
          .map((_, i) => ({
            id: `fresher-${i}`,
            difficultyLevel: 'Fresher',
          })),
        ...Array(25)
          .fill(null)
          .map((_, i) => ({ id: `junior-${i}`, difficultyLevel: 'Junior' })),
        ...Array(10)
          .fill(null)
          .map((_, i) => ({ id: `mid-${i}`, difficultyLevel: 'Mid' })),
        ...Array(5)
          .fill(null)
          .map((_, i) => ({ id: `midlate-${i}`, difficultyLevel: 'MidLate' })),
        ...Array(6)
          .fill(null)
          .map((_, i) => ({ id: `senior-${i}`, difficultyLevel: 'Senior' })),
      ];

      mockAssessmentTemplateModel.findByPk.mockResolvedValue(template);
      mockTopicModel.findByPk.mockResolvedValue({ id: dto.topicId });
      mockCategoryModel.findAll.mockResolvedValue([
        { id: dto.categoryIds[0] },
        { id: dto.categoryIds[1] },
      ]);
      mockTemplateQuestionModel.destroy.mockResolvedValue(0);

      // Mock findAll to return all questions at once
      mockQuestionModel.findAll.mockResolvedValue(mockAllQuestions);

      mockTemplateQuestionModel.create.mockResolvedValue({});

      const result = await service.generateQuestionsForTemplate(
        templateId,
        dto
      );

      expect(result.added).toBe(45);
      expect(result.message).toContain('Successfully generated 45 questions');
      expect(mockTemplateQuestionModel.destroy).toHaveBeenCalledWith({
        where: { templateId },
      });
      expect(mockQuestionModel.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if template not found', async () => {
      jest.clearAllMocks(); // Reset mocks
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue(null);

      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(`Template with ID ${templateId} not found`);
    });

    it('should throw NotFoundException if topic not found', async () => {
      jest.clearAllMocks();
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue({
        id: templateId,
        difficultyDistribution: { Fresher: 12 },
      });
      mockTopicModel.findByPk.mockResolvedValue(null);

      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(`Topic with ID ${dto.topicId} not found`);
    });

    it('should throw BadRequestException if categories not found or do not belong to topic', async () => {
      jest.clearAllMocks();
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: [
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002',
        ],
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue({
        id: templateId,
        difficultyDistribution: { Fresher: 12 },
      });
      mockTopicModel.findByPk.mockResolvedValue({ id: dto.topicId });
      mockCategoryModel.findAll.mockResolvedValue([{ id: dto.categoryIds[0] }]); // Only one category found

      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(
        'One or more categories not found or do not belong to the specified topic'
      );
    });

    it('should throw BadRequestException if difficulty distribution does not total 100 points', async () => {
      jest.clearAllMocks();
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
      };
      const template = {
        id: templateId,
        difficultyDistribution: {
          Fresher: 10, // 10 * 1 = 10 points (not 100)
        },
      };
      mockAssessmentTemplateModel.findByPk.mockResolvedValue(template);
      mockTopicModel.findByPk.mockResolvedValue({ id: dto.topicId });
      mockCategoryModel.findAll.mockResolvedValue([{ id: dto.categoryIds[0] }]);

      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(
        'Difficulty distribution must total to 100 points. Current total: 10'
      );
    });

    it('should throw BadRequestException if not enough questions available', async () => {
      jest.clearAllMocks();
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: ['123e4567-e89b-12d3-a456-426614174001'],
      };
      const template = {
        id: templateId,
        difficultyDistribution: {
          Fresher: 12,
          Junior: 21,
          Mid: 6,
          MidLate: 2,
          Senior: 4,
        },
      };

      // Create mock questions with insufficient Fresher questions
      const mockAllQuestions = [
        ...Array(5)
          .fill(null)
          .map((_, i) => ({ id: `fresher-${i}`, difficultyLevel: 'Fresher' })), // Only 5 instead of 12
        ...Array(25)
          .fill(null)
          .map((_, i) => ({ id: `junior-${i}`, difficultyLevel: 'Junior' })),
        ...Array(10)
          .fill(null)
          .map((_, i) => ({ id: `mid-${i}`, difficultyLevel: 'Mid' })),
        ...Array(5)
          .fill(null)
          .map((_, i) => ({ id: `midlate-${i}`, difficultyLevel: 'MidLate' })),
        ...Array(6)
          .fill(null)
          .map((_, i) => ({ id: `senior-${i}`, difficultyLevel: 'Senior' })),
      ];

      mockAssessmentTemplateModel.findByPk.mockResolvedValue(template);
      mockTopicModel.findByPk.mockResolvedValue({ id: dto.topicId });
      mockCategoryModel.findAll.mockResolvedValue([{ id: dto.categoryIds[0] }]);
      mockTemplateQuestionModel.destroy.mockResolvedValue(0);
      mockQuestionModel.findAll.mockResolvedValue(mockAllQuestions);

      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.generateQuestionsForTemplate(templateId, dto)
      ).rejects.toThrow(
        'Not enough questions found for difficulty level Fresher. Required: 12, Available: 5'
      );
    });
  });
});
