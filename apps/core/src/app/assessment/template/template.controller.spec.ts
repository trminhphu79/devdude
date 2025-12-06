import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import {
  CreateAssessmentTemplateDto,
  UpdateAssessmentTemplateDto,
  AddQuestionToTemplateDto,
  GenerateTemplateQuestionsDto,
} from '@devdude/common/dtos';

const mockTemplateService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addQuestion: jest.fn(),
  removeQuestion: jest.fn(),
  getTemplateQuestions: jest.fn(),
  generateQuestionsForTemplate: jest.fn(),
};

describe('TemplateController', () => {
  let controller: TemplateController;
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
    service = module.get<TemplateService>(TemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      mockTemplateService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto);
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
      mockTemplateService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
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
      mockTemplateService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(templateId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(templateId);
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
        totalQuestions: 45,
        difficultyDistribution: { Fresher: 12 },
        ...dto,
      };
      mockTemplateService.update.mockResolvedValue(updatedTemplate);

      const result = await controller.update(templateId, dto);

      expect(result).toEqual(updatedTemplate);
      expect(service.update).toHaveBeenCalledWith(templateId, dto);
    });
  });

  describe('remove', () => {
    it('should remove a template', async () => {
      const templateId = '1';
      mockTemplateService.remove.mockResolvedValue(undefined);

      await controller.remove(templateId);

      expect(service.remove).toHaveBeenCalledWith(templateId);
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
      mockTemplateService.addQuestion.mockResolvedValue(expectedResult);

      const result = await controller.addQuestion(templateId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.addQuestion).toHaveBeenCalledWith(templateId, dto);
    });
  });

  describe('removeQuestion', () => {
    it('should remove a question from template', async () => {
      const templateId = '1';
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      mockTemplateService.removeQuestion.mockResolvedValue(undefined);

      await controller.removeQuestion(templateId, questionId);

      expect(service.removeQuestion).toHaveBeenCalledWith(
        templateId,
        questionId
      );
    });
  });

  describe('getQuestions', () => {
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
      mockTemplateService.getTemplateQuestions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getQuestions(templateId);

      expect(result).toEqual(expectedResult);
      expect(service.getTemplateQuestions).toHaveBeenCalledWith(templateId);
    });
  });

  describe('generateQuestions', () => {
    it('should generate questions for template', async () => {
      const templateId = '1';
      const dto: GenerateTemplateQuestionsDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        categoryIds: [
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002',
        ],
      };
      const expectedResult = {
        added: 45,
        message: 'Successfully generated 45 questions for template',
      };
      mockTemplateService.generateQuestionsForTemplate.mockResolvedValue(
        expectedResult
      );

      const result = await controller.generateQuestions(templateId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.generateQuestionsForTemplate).toHaveBeenCalledWith(
        templateId,
        dto
      );
    });
  });
});
