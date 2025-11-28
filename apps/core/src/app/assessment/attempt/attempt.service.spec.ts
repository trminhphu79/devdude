import { Test, TestingModule } from '@nestjs/testing';
import { AttemptService } from './attempt.service';
import { getModelToken } from '@nestjs/sequelize';
import { Attempt } from '../../shared/models/attempt';
import { AttemptAnswer } from '../../shared/models/attempt-answer';
import { Account } from '../../shared/models/account';
import { AssessmentTemplate } from '../../shared/models/assessment-template';
import { NotFoundException } from '@nestjs/common';
import {
  CreateAttemptDto,
  SubmitAnswersDto,
  UpdateAttemptDto,
} from '@devdue/common';

const mockAttempt = {
  id: 'attempt-id',
  accountId: 'account-id',
  templateId: 'template-id',
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockAccount = {
  id: 'account-id',
  email: 'test@example.com',
};

const mockTemplate = {
  id: 'template-id',
};

const mockAttemptAnswer = {
  id: 'answer-id',
};

describe('AttemptService', () => {
  let service: AttemptService;
  let attemptModel: typeof Attempt;
  let accountModel: typeof Account;
  let templateModel: typeof AssessmentTemplate;
  let attemptAnswerModel: typeof AttemptAnswer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttemptService,
        {
          provide: getModelToken(Attempt),
          useValue: {
            create: jest.fn().mockResolvedValue(mockAttempt),
            findAll: jest.fn().mockResolvedValue([mockAttempt]),
            findByPk: jest.fn().mockResolvedValue(mockAttempt),
          },
        },
        {
          provide: getModelToken(AttemptAnswer),
          useValue: {
            bulkCreate: jest.fn().mockResolvedValue([mockAttemptAnswer]),
          },
        },
        {
          provide: getModelToken(Account),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockAccount),
            create: jest.fn().mockResolvedValue(mockAccount),
          },
        },
        {
          provide: getModelToken(AssessmentTemplate),
          useValue: {
            findByPk: jest.fn().mockResolvedValue(mockTemplate),
          },
        },
      ],
    }).compile();

    service = module.get<AttemptService>(AttemptService);
    attemptModel = module.get<typeof Attempt>(getModelToken(Attempt));
    accountModel = module.get<typeof Account>(getModelToken(Account));
    templateModel = module.get<typeof AssessmentTemplate>(
      getModelToken(AssessmentTemplate)
    );
    attemptAnswerModel = module.get<typeof AttemptAnswer>(
      getModelToken(AttemptAnswer)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an attempt', async () => {
      const dto: CreateAttemptDto = {
        email: 'test@example.com',
        fullName: 'Test User',
        templateId: 'template-id',
      };

      const result = await service.create(dto);

      expect(templateModel.findByPk).toHaveBeenCalledWith('template-id');
      expect(accountModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(attemptModel.create).toHaveBeenCalledWith({
        accountId: 'account-id',
        templateId: 'template-id',
        startedAt: expect.any(Date),
      });
      expect(result).toEqual(mockAttempt);
    });

    it('should create an account if not found', async () => {
      jest.spyOn(accountModel, 'findOne').mockResolvedValue(null);
      const dto: CreateAttemptDto = {
        email: 'new@example.com',
        fullName: 'New User',
        templateId: 'template-id',
      };

      await service.create(dto);

      expect(accountModel.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        fullName: 'New User',
        isActive: true,
      });
    });

    it('should throw NotFoundException if template not found', async () => {
      jest.spyOn(templateModel, 'findByPk').mockResolvedValue(null);
      const dto: CreateAttemptDto = {
        email: 'test@example.com',
        fullName: 'Test User',
        templateId: 'invalid-id',
      };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of attempts', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAttempt]);
      expect(attemptModel.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single attempt', async () => {
      const result = await service.findOne('attempt-id');
      expect(result).toEqual(mockAttempt);
      expect(attemptModel.findByPk).toHaveBeenCalledWith(
        'attempt-id',
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if attempt not found', async () => {
      jest.spyOn(attemptModel, 'findByPk').mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update an attempt', async () => {
      const dto: UpdateAttemptDto = { totalScore: 100 };
      await service.update('attempt-id', dto);
      expect(mockAttempt.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('should remove an attempt', async () => {
      await service.remove('attempt-id');
      expect(mockAttempt.destroy).toHaveBeenCalled();
    });
  });

  describe('submitAnswers', () => {
    it('should create attempt answers', async () => {
      const dto: SubmitAnswersDto = {
        answers: [
          {
            questionId: 'q-id',
            textAnswer: 'answer',
            timeTakenSec: 10,
          },
        ],
      };

      const result = await service.submitAnswers('attempt-id', dto);

      expect(attemptModel.findByPk).toHaveBeenCalledWith('attempt-id');
      expect(attemptAnswerModel.bulkCreate).toHaveBeenCalledWith([
        {
          attemptId: 'attempt-id',
          ...dto.answers[0],
        },
      ]);
      expect(result).toEqual([mockAttemptAnswer]);
    });

    it('should throw NotFoundException if attempt not found', async () => {
      jest.spyOn(attemptModel, 'findByPk').mockResolvedValue(null);
      const dto: SubmitAnswersDto = {
        answers: [
          {
            questionId: 'q-id',
            timeTakenSec: 10,
          },
        ],
      };

      await expect(service.submitAnswers('invalid-id', dto)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
