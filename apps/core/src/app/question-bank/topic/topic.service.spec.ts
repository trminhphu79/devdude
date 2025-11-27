import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { getModelToken } from '@nestjs/sequelize';
import { Topic } from '../../shared/models/topic';
import { NotFoundException } from '@nestjs/common';

const mockTopic = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('TopicService', () => {
  let service: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: getModelToken(Topic),
          useValue: mockTopic,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic', async () => {
      const dto = { name: 'Test', description: 'Desc', isActive: true };
      mockTopic.create.mockResolvedValue(dto);
      expect(await service.create(dto)).toEqual(dto);
      expect(mockTopic.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const result = [{ name: 'Test' }];
      mockTopic.findAll.mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a topic', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      const result = { id: topicId, name: 'Test' };
      mockTopic.findByPk.mockResolvedValue(result);
      expect(await service.findOne(topicId)).toEqual(result);
    });

    it('should throw NotFoundException if not found', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      mockTopic.findByPk.mockResolvedValue(null);
      await expect(service.findOne(topicId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      const result = { ...dto, id: topicId };
      mockTopic.update.mockResolvedValue([1, [result]]);
      expect(await service.update(topicId, dto)).toEqual(result);
    });

    it('should throw NotFoundException if not found', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      mockTopic.update.mockResolvedValue([0, []]);
      await expect(service.update(topicId, {})).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove a topic', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      mockTopic.destroy.mockResolvedValue(1);
      await expect(service.remove(topicId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if not found', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      mockTopic.destroy.mockResolvedValue(0);
      await expect(service.remove(topicId)).rejects.toThrow(NotFoundException);
    });
  });
});
