import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentTemplateDto } from './create-assessment-template.dto';

export class UpdateAssessmentTemplateDto extends PartialType(
  CreateAssessmentTemplateDto
) {}
