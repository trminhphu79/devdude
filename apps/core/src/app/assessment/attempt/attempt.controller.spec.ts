import { Test, TestingModule } from '@nestjs/testing';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import {
  CreateAttemptDto,
  SubmitAnswersDto,
  UpdateAttemptDto,
} from '@devdue/common';

describe('AttemptController', () => {
  let controller: AttemptController;
  let service: AttemptService;

  const mockAttemptService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    submitAnswers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttemptController],
      providers: [
        {
          provide: AttemptService,
          useValue: mockAttemptService,
        },
      ],
    }).compile();

    controller = module.get<AttemptController>(AttemptController);
    service = module.get<AttemptService>(AttemptService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto: CreateAttemptDto = {
        email: 'test@example.com',
        fullName: 'Test',
        templateId: 'id',
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      await controller.findOne('id');
      expect(service.findOne).toHaveBeenCalledWith('id');
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto: UpdateAttemptDto = { totalScore: 10 };
      await controller.update('id', dto);
      expect(service.update).toHaveBeenCalledWith('id', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      await controller.remove('id');
      expect(service.remove).toHaveBeenCalledWith('id');
    });
  });

  describe('submitAnswers', () => {
    it('should call service.submitAnswers', async () => {
      const dto: SubmitAnswersDto = {
        answers: [{ questionId: 'q', timeTakenSec: 1 }],
      };
      await controller.submitAnswers('id', dto);
      expect(service.submitAnswers).toHaveBeenCalledWith('id', dto);
    });
  });
});
