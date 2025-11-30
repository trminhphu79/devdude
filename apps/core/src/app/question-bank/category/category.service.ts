import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../../shared/models/category';
import { CreateCategoryDto, UpdateCategoryDto } from '@devdude/common';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create({ ...createCategoryDto });
  }

  findAll() {
    return this.categoryModel.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const [affectedCount, [updatedCategory]] = await this.categoryModel.update(
      updateCategoryDto,
      {
        where: { id },
        returning: true,
      }
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async remove(id: string) {
    const deletedCount = await this.categoryModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
