import { PartialType } from '@nestjs/swagger';

export class CreateLessonDto {}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
