export class Time implements ApiTime {
  constructor(
    public hours: number,
    public minutes: number,
    public seconds: number,
  ) {}

  static fromString(value: string) {
    const [hours, minutes, seconds] = value.split(':');
    const hoursAsNumber = Number.parseInt(hours!, 10);
    const minutesAsNumber = Number.parseInt(minutes!, 10);
    const secondsAsNumber = Number.parseInt(seconds!, 10);
    return new Time(hoursAsNumber, minutesAsNumber, secondsAsNumber);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static fromDate(date: Date) {
    return new Time(
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
  }

  toString() {
    return `${this.hours}:${this.minutes}:${this.seconds}`;
  }

  getSeconds() {
    return this.seconds + this.minutes * 60 + this.hours * 60 * 60;
  }
}
