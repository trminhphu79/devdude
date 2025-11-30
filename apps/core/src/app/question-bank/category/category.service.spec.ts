import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../shared/models/category';
import { CreateCategoryDto, UpdateCategoryDto } from '@devdude/common';

const mockCategoryModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDto = {
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Category',
        description: 'Test Description',
      };
      const expectedResult = { id: '1', ...dto };
      mockCategoryModel.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(result).toEqual(expectedResult);
      expect(mockCategoryModel.create).toHaveBeenCalledWith({ ...dto });
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
      mockCategoryModel.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockCategoryModel.findAll).toHaveBeenCalled();
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
      mockCategoryModel.findByPk.mockResolvedValue(expectedResult);

      const result = await service.findOne(categoryId);

      expect(result).toEqual(expectedResult);
      expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(categoryId);
    });

    it('should throw NotFoundException if category not found', async () => {
      const categoryId = '1';
      mockCategoryModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(categoryId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne(categoryId)).rejects.toThrow(
        `Category with ID ${categoryId} not found`
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = '1';
      const dto: UpdateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };
      const updatedCategory = {
        id: categoryId,
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        ...dto,
      };
      mockCategoryModel.update.mockResolvedValue([1, [updatedCategory]]);

      const result = await service.update(categoryId, dto);

      expect(result).toEqual(updatedCategory);
      expect(mockCategoryModel.update).toHaveBeenCalledWith(dto, {
        where: { id: categoryId },
        returning: true,
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      const categoryId = '1';
      const dto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      mockCategoryModel.update.mockResolvedValue([0, []]);

      await expect(service.update(categoryId, dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.update(categoryId, dto)).rejects.toThrow(
        `Category with ID ${categoryId} not found`
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = '1';
      mockCategoryModel.destroy.mockResolvedValue(1);

      const result = await service.remove(categoryId);

      expect(result).toEqual({ deleted: true });
      expect(mockCategoryModel.destroy).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      const categoryId = '1';
      mockCategoryModel.destroy.mockResolvedValue(0);

      await expect(service.remove(categoryId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.remove(categoryId)).rejects.toThrow(
        `Category with ID ${categoryId} not found`
      );
    });
  });
});
