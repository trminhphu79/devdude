import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QuestionService } from './question.service';
import { Question } from '../../shared/models/question';
import { AnswerOption } from '../../shared/models/answer-option';
import { CreateQuestionDto, UpdateQuestionDto } from '@devdude/common/dtos';
import { QuestionType, DifficultyLevel } from '@devdude/common/enums';

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const mockSequelize = {
  transaction: jest.fn().mockResolvedValue(mockTransaction),
};

const mockQuestionModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockAnswerOptionModel = {
  bulkCreate: jest.fn(),
  destroy: jest.fn(),
};

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getModelToken(Question),
          useValue: mockQuestionModel,
        },
        {
          provide: getModelToken(AnswerOption),
          useValue: mockAnswerOptionModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        ],
      };

      const createdQuestion = {
        id: '456e7890-e89b-12d3-a456-426614174001',
        categoryId: dto.categoryId,
        type: dto.type,
        difficultyLevel: dto.difficultyLevel,
        weight: dto.weight,
        timeLimitSec: dto.timeLimitSec,
        content: dto.content,
        explanation: dto.explanation,
        createdBy: dto.createdBy,
      };

      const questionWithOptions = {
        ...createdQuestion,
        options: dto.options.map((opt, idx) => ({
          id: `opt-${idx}`,
          questionId: createdQuestion.id,
          ...opt,
        })),
      };

      mockQuestionModel.create.mockResolvedValue(createdQuestion);
      mockAnswerOptionModel.bulkCreate.mockResolvedValue([]);
      mockQuestionModel.findByPk.mockResolvedValue(questionWithOptions);

      const result = await service.create(dto);

      expect(result).toEqual(questionWithOptions);
      expect(mockQuestionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryId: dto.categoryId,
          type: dto.type,
          difficultyLevel: dto.difficultyLevel,
          weight: dto.weight,
          timeLimitSec: dto.timeLimitSec,
          content: dto.content,
          explanation: dto.explanation,
          createdBy: dto.createdBy,
        }),
        { transaction: mockTransaction }
      );
      expect(mockAnswerOptionModel.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'A programming language',
            isCorrect: true,
            questionId: createdQuestion.id,
          }),
          expect.objectContaining({
            text: 'A database',
            isCorrect: false,
            questionId: createdQuestion.id,
          }),
        ]),
        { transaction: mockTransaction }
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const dto: CreateQuestionDto = {
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        type: QuestionType.SINGLE_CHOICE,
        difficultyLevel: DifficultyLevel.JUNIOR,
        weight: 10,
        timeLimitSec: 300,
        content: 'Test question',
        explanation: 'Test explanation',
        createdBy: 'admin',
        options: [{ text: 'Option 1', isCorrect: true }],
      };

      mockQuestionModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(dto)).rejects.toThrow('Database error');
      expect(mockTransaction.rollback).toHaveBeenCalled();
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

      mockQuestionModel.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockQuestionModel.findAll).toHaveBeenCalledWith({
        include: [AnswerOption],
      });
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
        ],
      };

      mockQuestionModel.findByPk.mockResolvedValue(expectedResult);

      const result = await service.findOne(questionId);

      expect(result).toEqual(expectedResult);
      expect(mockQuestionModel.findByPk).toHaveBeenCalledWith(questionId, {
        include: [AnswerOption],
      });
    });

    it('should throw NotFoundException if question not found', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      mockQuestionModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(questionId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne(questionId)).rejects.toThrow(
        `Question with ID ${questionId} not found`
      );
    });
  });

  describe('update', () => {
    it('should update a question and replace its answer options', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateQuestionDto = {
        content: 'Updated question content',
        options: [
          { text: 'Updated option 1', isCorrect: true },
          { text: 'Updated option 2', isCorrect: false },
        ],
      };

      const updatedQuestion = {
        id: questionId,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        type: QuestionType.SINGLE_CHOICE,
        difficultyLevel: DifficultyLevel.JUNIOR,
        weight: 10,
        timeLimitSec: 300,
        content: dto.content,
        explanation: 'Original explanation',
        createdBy: 'admin',
        options: dto.options.map((opt, idx) => ({
          id: `opt-${idx}`,
          questionId,
          ...opt,
        })),
      };

      mockQuestionModel.update.mockResolvedValue([1]);
      mockAnswerOptionModel.destroy.mockResolvedValue(2);
      mockAnswerOptionModel.bulkCreate.mockResolvedValue([]);
      mockQuestionModel.findByPk.mockResolvedValue(updatedQuestion);

      const result = await service.update(questionId, dto);

      expect(result).toEqual(updatedQuestion);
      expect(mockQuestionModel.update).toHaveBeenCalledWith(
        { content: dto.content },
        { where: { id: questionId }, transaction: mockTransaction }
      );
      expect(mockAnswerOptionModel.destroy).toHaveBeenCalledWith({
        where: { questionId },
        transaction: mockTransaction,
      });
      expect(mockAnswerOptionModel.bulkCreate).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw NotFoundException if question not found', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateQuestionDto = { content: 'Updated content' };

      mockQuestionModel.update.mockResolvedValue([0]);

      await expect(service.update(questionId, dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.update(questionId, dto)).rejects.toThrow(
        `Question with ID ${questionId} not found`
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a question and its answer options', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';

      mockAnswerOptionModel.destroy.mockResolvedValue(3);
      mockQuestionModel.destroy.mockResolvedValue(1);

      const result = await service.remove(questionId);

      expect(result).toEqual({ deleted: true });
      expect(mockAnswerOptionModel.destroy).toHaveBeenCalledWith({
        where: { questionId },
        transaction: mockTransaction,
      });
      expect(mockQuestionModel.destroy).toHaveBeenCalledWith({
        where: { id: questionId },
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw NotFoundException if question not found', async () => {
      const questionId = '123e4567-e89b-12d3-a456-426614174000';

      mockAnswerOptionModel.destroy.mockResolvedValue(0);
      mockQuestionModel.destroy.mockResolvedValue(0);

      await expect(service.remove(questionId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.remove(questionId)).rejects.toThrow(
        `Question with ID ${questionId} not found`
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
