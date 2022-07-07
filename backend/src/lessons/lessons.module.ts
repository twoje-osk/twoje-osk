import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
  imports: [TypeOrmModule.forFeature([Lesson])],
})
export class LessonsModule {}
