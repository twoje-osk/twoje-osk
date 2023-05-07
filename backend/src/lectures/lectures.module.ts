import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturesController } from './lectures.controller';
import { LecturesService } from './lectures.service';
import { Lecture } from './entities/lecture.entity';

@Module({
  controllers: [LecturesController],
  imports: [TypeOrmModule.forFeature([Lecture])],
  exports: [LecturesService],
  providers: [LecturesService],
})
export class LecturesModule {}
