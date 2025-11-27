import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import {
  CreateAssessmentTemplateDto,
  UpdateAssessmentTemplateDto,
  AddQuestionToTemplateDto,
  GenerateTemplateQuestionsDto,
} from '@devdue/common';

@ApiTags('templates')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assessment template' })
  @ApiResponse({
    status: 201,
    description: 'The template has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  create(@Body() createTemplateDto: CreateAssessmentTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assessment templates' })
  @ApiResponse({ status: 200, description: 'Return all templates.' })
  findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific assessment template' })
  @ApiResponse({ status: 200, description: 'Return the template.' })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assessment template' })
  @ApiResponse({
    status: 200,
    description: 'The template has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateAssessmentTemplateDto
  ) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an assessment template' })
  @ApiResponse({
    status: 204,
    description: 'The template has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add a question to the template' })
  @ApiResponse({
    status: 201,
    description: 'The question has been successfully added to the template.',
  })
  @ApiResponse({ status: 404, description: 'Template or Question not found.' })
  @ApiResponse({
    status: 400,
    description: 'Question already exists in template.',
  })
  addQuestion(
    @Param('id') id: string,
    @Body() addQuestionDto: AddQuestionToTemplateDto
  ) {
    return this.templateService.addQuestion(id, addQuestionDto);
  }

  @Delete(':id/questions/:questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a question from the template' })
  @ApiResponse({
    status: 204,
    description:
      'The question has been successfully removed from the template.',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found in template.',
  })
  removeQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string
  ) {
    return this.templateService.removeQuestion(id, questionId);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'Get all questions in the template' })
  @ApiResponse({
    status: 200,
    description: 'Return all questions in the template.',
  })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  getQuestions(@Param('id') id: string) {
    return this.templateService.getTemplateQuestions(id);
  }

  @Post(':id/generate-questions')
  @ApiOperation({
    summary:
      'Auto-generate and assign questions to template based on difficulty distribution',
  })
  @ApiResponse({
    status: 201,
    description:
      'Questions have been successfully generated and assigned to the template.',
  })
  @ApiResponse({
    status: 404,
    description: 'Template, Topic, or Category not found.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid difficulty distribution or not enough questions available.',
  })
  generateQuestions(
    @Param('id') id: string,
    @Body() generateDto: GenerateTemplateQuestionsDto
  ) {
    return this.templateService.generateQuestionsForTemplate(id, generateDto);
  }
}
