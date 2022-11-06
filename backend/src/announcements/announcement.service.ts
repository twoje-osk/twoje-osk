import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DtoCreateAnnouncement, DtoUpdateAnnouncement } from '@osk/shared';
import { CurrentUserService } from 'current-user/current-user.service';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { getFailure, getSuccess, Try } from 'types/Try';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
  ) {}

  async findAll() {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const announcements = await this.announcementsRepository.find({
      where: {
        createdBy: {
          organizationId,
        },
      },
      relations: {
        createdBy: true,
      },
    });
    return announcements;
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

  @Transactional()
  async create(announcement: DtoCreateAnnouncement): Promise<number> {
    const author = this.currentUserService.getRequestCurrentUser();
    const newAnnouncement = await this.announcementsRepository.save({
      subject: announcement.subject,
      body: announcement.body,
      createdAt: new Date(),
      createdById: author.userId,
    });
    return newAnnouncement.id;
  }

  @Transactional()
  async update(
    announcement: DtoUpdateAnnouncement,
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

  @Transactional()
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
