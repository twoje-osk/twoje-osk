import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsController } from './announcement.controller';
import { AnnouncementsService } from './announcement.service';
import { Announcement } from './entities/announcement.entity';

@Module({
  controllers: [AnnouncementsController],
  imports: [TypeOrmModule.forFeature([Announcement])],
  exports: [AnnouncementsService],
  providers: [AnnouncementsService],
})
export class AnnouncementsModule {}
