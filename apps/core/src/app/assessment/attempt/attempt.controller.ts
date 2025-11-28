import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttemptService } from './attempt.service';
import {
  CreateAttemptDto,
  UpdateAttemptDto,
  SubmitAnswersDto,
} from '@devdue/common';

@Controller('attempt')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post()
  create(@Body() createAttemptDto: CreateAttemptDto) {
    return this.attemptService.create(createAttemptDto);
  }

  @Get()
  findAll() {
    return this.attemptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attemptService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttemptDto: UpdateAttemptDto) {
    return this.attemptService.update(id, updateAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attemptService.remove(id);
  }

  @Post(':id/answers')
  submitAnswers(
    @Param('id') id: string,
    @Body() submitAnswersDto: SubmitAnswersDto
  ) {
    return this.attemptService.submitAnswers(id, submitAnswersDto);
  }
}
