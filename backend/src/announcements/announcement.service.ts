import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from '@osk/shared';
import { Repository } from 'typeorm';
import { CurrentUserService } from '../current-user/current-user.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { getLimitArguments } from '../utils/presentationArguments';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { AnnouncementPresentationArguments } from './announcement.types';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
  ) {}

  async findAll(presentationArguments?: AnnouncementPresentationArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [announcements, count] =
      await this.announcementsRepository.findAndCount({
        ...limitArguments,
        order: { createdAt: { direction: 'desc' } },
        where: { createdBy: { organizationId } },
        relations: { createdBy: true },
      });

    return { announcements, count };
  }

  async findOne(id: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const announcement = await this.announcementsRepository.findOne({
      where: {
        id,
        createdBy: {
          organizationId,
        },
      },
      relations: {
        createdBy: true,
      },
    });
    return announcement;
  }

  @TransactionalWithTry()
  async create(
    announcement: CreateAnnouncementDto,
  ): Promise<Try<number, never>> {
    const author = this.currentUserService.getRequestCurrentUser();
    const newAnnouncement = await this.announcementsRepository.save({
      subject: announcement.subject,
      body: announcement.body,
      createdAt: new Date(),
      createdById: author.userId,
    });

    return getSuccess(newAnnouncement.id);
  }

  @TransactionalWithTry()
  async update(
    announcement: UpdateAnnouncementDto,
    announcementId: number,
  ): Promise<Try<number, 'NO_SUCH_ANNOUNCEMENT'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const announcementToBeUpdated = await this.announcementsRepository.findOne({
      where: {
        createdBy: {
          organizationId,
        },
        id: announcementId,
      },
      relations: {
        createdBy: true,
      },
    });

    if (announcementToBeUpdated === null) {
      return getFailure('NO_SUCH_ANNOUNCEMENT');
    }

    const updatedAnnouncement = await this.announcementsRepository.save(
      this.announcementsRepository.merge(announcementToBeUpdated, announcement),
    );

    return getSuccess(updatedAnnouncement.id);
  }

  @TransactionalWithTry()
  async delete(
    announcementId: number,
  ): Promise<Try<undefined, 'ANNOUNCEMENT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const announcementToBeRemoved = await this.announcementsRepository.findOne({
      where: {
        id: announcementId,
        createdBy: {
          organizationId,
        },
      },
      relations: {
        createdBy: true,
      },
    });

    if (announcementToBeRemoved === null) {
      return getFailure('ANNOUNCEMENT_NOT_FOUND');
    }

    await this.announcementsRepository.delete(announcementToBeRemoved.id);

    return getSuccess(undefined);
  }
}
