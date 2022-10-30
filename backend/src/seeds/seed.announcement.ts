import { Announcement } from '../announcements/entities/announcement.entity';
import { usersFactory } from './seed.user';
import { Factory } from './seed.utils';

class AnnouncementFactory extends Factory<Announcement> {
  constructor() {
    super(Announcement);
  }

  public generate() {
    const announcement = new Announcement();
    announcement.subject = this.faker.lorem.word(4);
    announcement.body = this.faker.lorem.lines(4);
    announcement.createdBy =
      usersFactory.getAll()[0] ?? usersFactory.generate();
    announcement.createdAt = new Date();
    this.entities.push(announcement);
    return announcement;
  }
}

export const announcementFactory = new AnnouncementFactory();

export const seedAnnouncements = () => {
  const toBeCreatedAt = new Date('10/1/22');
  return [
    announcementFactory.generateFromData({
      subject: 'Nieobecność p. Kowalskiego',
      body: 'Z powodu nieobecności pana Kowalskiego, w przyszłym tygodniu, wszystkie jego jazdy zostały automatycznie przesunięte na przyszły tydzień. W razie pytań prosimy kierować się bezpośrednio do p. Kowalskiego',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
    announcementFactory.generateFromData({
      subject: 'Nieobecność p. Nowaka',
      body: 'Z powodu nieobecności pana Nowaka, w przyszłym tygodniu, wszystkie jego jazdy zostały automatycznie przesunięte na przyszły tydzień. W razie pytań prosimy kierować się bezpośrednio do p. Nowaka',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
    announcementFactory.generateFromData({
      subject: 'Zajęcia teoretyczne',
      body: 'Nowy kurs teoretyczny na kategorię B zaczyna się w piątek 04.11.22 o 18, w sali b22',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
    announcementFactory.generateFromData({
      subject: 'Awaria samochodu',
      body: 'Z powodu awarii samochodu Hyundai i30, w którym odbywały się lekcje p. Kowalskiego, wszystkie jazdy w przyszłym tygodniu zostają odwołane',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
    announcementFactory.generateFromData({
      subject: 'Awaria samochodu',
      body: 'Z powodu awarii samochodu Hyundai i20, w którym odbywały się lekcje p. Nowaka, wszystkie jego jazdy w przyszłym tygodniu zostają odwołane',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
    announcementFactory.generateFromData({
      subject: 'Nieobecność p. Kowalskiego',
      body: 'Z powodu nieobecności pana Kowalskiego, w przyszłym tygodniu, wszystkie jego jazdy zostały automatycznie przesunięte na przyszły tydzień. W razie pytań prosimy kierować się bezpośrednio do p. Kowalskiego. \n\n Dodatkowo w piątek o 17:30 rozpoczynamy kurs teoretyczny dla kursantów, którzy byli rejestrowani do szkoły po 21.09.2022. Każdy kursant musi wziąć udział w trzech wykładach teoretycznych przed rozpoczęciem zajęć praktycznych',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
    announcementFactory.generateFromData({
      subject: 'Nieobecność p. Kowalskiego',
      body: 'Z powodu nieobecności pana Kowalskiego, w przyszłym tygodniu, wszystkie jego jazdy zostały automatycznie przesunięte na przyszły tydzień. W razie pytań prosimy kierować się bezpośrednio do p. Kowalskiego',
      createdAt: new Date(toBeCreatedAt.setDate(toBeCreatedAt.getDate() + 1)),
      createdBy: usersFactory.getAll()[0],
    }),
  ];
};
