import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@devdude/common/dtos';

const mockCategoryService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Category',
        description: 'Test Description',
      };
      const expectedResult = { id: '1', ...dto };
      mockCategoryService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const expectedResult = [
        {
          id: '1',
          topicId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Category 1',
          description: 'Description 1',
        },
        {
          id: '2',
          topicId: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Category 2',
          description: 'Description 2',
        },
      ];
      mockCategoryService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = '1';
      const expectedResult = {
        id: categoryId,
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Category',
        description: 'Test Description',
      };
      mockCategoryService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(categoryId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = '1';
      const dto: UpdateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };
      const expectedResult = {
        id: categoryId,
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        ...dto,
      };
      mockCategoryService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(categoryId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(categoryId, dto);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = '1';
      const expectedResult = { deleted: true };
      mockCategoryService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(categoryId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(categoryId);
    });
  });
});
