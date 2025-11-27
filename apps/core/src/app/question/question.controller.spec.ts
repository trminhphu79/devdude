import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import {
  CreateQuestionDto,
  QuestionType,
  DifficultyLevel,
} from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

const mockQuestionService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a question with answer options', async () => {
      const dto: CreateQuestionDto = {
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        type: QuestionType.SINGLE_CHOICE,
        difficultyLevel: DifficultyLevel.JUNIOR,
        weight: 10,
        timeLimitSec: 300,
        content: 'What is TypeScript?',
        explanation: 'TypeScript is a superset of JavaScript',
        createdBy: 'admin',
        options: [
          { text: 'A programming language', isCorrect: true },
          { text: 'A database', isCorrect: false },
          { text: 'An operating system', isCorrect: false },
        ],
      };

      const expectedResult = {
        id: '456e7890-e89b-12d3-a456-426614174001',
        ...dto,
        options: dto.options.map((opt, idx) => ({
          id: `opt-${idx}`,
          questionId: '456e7890-e89b-12d3-a456-426614174001',
          ...opt,
        })),
      };

      mockQuestionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of questions with answer options', async () => {
      const expectedResult = [
        {
          id: '1',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          type: QuestionType.SINGLE_CHOICE,
          difficultyLevel: DifficultyLevel.JUNIOR,
          weight: 10,
          timeLimitSec: 300,
          content: 'Question 1',
          explanation: 'Explanation 1',
          createdBy: 'admin',
          options: [
            { id: 'opt-1', text: 'Option 1', isCorrect: true },
            { id: 'opt-2', text: 'Option 2', isCorrect: false },
          ],
        },
      ];

      mockQuestionService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a question with answer options by id', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = {
        id: questionId,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        type: QuestionType.MULTI_CHOICE,
        difficultyLevel: DifficultyLevel.MID,
        weight: 15,
        timeLimitSec: 600,
        content: 'Select all correct answers',
        explanation: 'Multiple answers are correct',
        createdBy: 'admin',
        options: [
          { id: 'opt-1', text: 'Correct 1', isCorrect: true },
          { id: 'opt-2', text: 'Correct 2', isCorrect: true },
          { id: 'opt-3', text: 'Wrong', isCorrect: false },
        ],
      };

      mockQuestionService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(questionId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(questionId);
    });
  });

  describe('update', () => {
    it('should update a question and its answer options', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateQuestionDto = {
        content: 'Updated question content',
        options: [
          { text: 'Updated option 1', isCorrect: true },
          { text: 'Updated option 2', isCorrect: false },
        ],
      };

      const expectedResult = {
        id: questionId,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        type: QuestionType.SINGLE_CHOICE,
        difficultyLevel: DifficultyLevel.JUNIOR,
        weight: 10,
        timeLimitSec: 300,
        ...dto,
        createdBy: 'admin',
        explanation: 'Original explanation',
        options: dto.options.map((opt, idx) => ({
          id: `opt-${idx}`,
          questionId,
          ...opt,
        })),
      };

      mockQuestionService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(questionId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(questionId, dto);
    });
  });

  describe('remove', () => {
    it('should remove a question and its answer options', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { deleted: true };

      mockQuestionService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(questionId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(questionId);
    });
  });
});
