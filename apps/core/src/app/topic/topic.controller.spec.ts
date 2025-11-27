import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

const mockTopicService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TopicController', () => {
  let controller: TopicController;
  let service: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    }).compile();

    controller = module.get<TopicController>(TopicController);
    service = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic', async () => {
      const dto = { name: 'Test', description: 'Desc', isActive: true };
      mockTopicService.create.mockResolvedValue(dto);
      expect(await controller.create(dto)).toEqual(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const result = [{ name: 'Test' }];
      mockTopicService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a topic', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      const result = { id: topicId, name: 'Test' };
      mockTopicService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(topicId)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(topicId);
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      const result = { ...dto, id: topicId };
      mockTopicService.update.mockResolvedValue(result);
      expect(await controller.update(topicId, dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(topicId, dto);
    });
  });

  describe('remove', () => {
    it('should remove a topic', async () => {
      const topicId = '123e4567-e89b-12d3-a456-426614174000';
      mockTopicService.remove.mockResolvedValue(undefined);
      await expect(controller.remove(topicId)).resolves.not.toThrow();
      expect(service.remove).toHaveBeenCalledWith(topicId);
    });
  });
});
