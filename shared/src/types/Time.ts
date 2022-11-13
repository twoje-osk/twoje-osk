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

  static fromApiTimeString(apiTime: ApiTime) {
    return new Time(apiTime.hours, apiTime.minutes, apiTime.seconds);
  }

  fromString(value: string) {
    return Time.fromString(value);
  }

  toString() {
    return `${this.hours}:${this.minutes}:${this.seconds}`;
  }

  getSeconds() {
    return this.seconds + this.minutes * 60 + this.hours * 60 * 60;
  }
}
