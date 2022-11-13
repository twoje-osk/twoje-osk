import { Time } from '@osk/shared';
import {
  Column,
  Entity,
  FindOperator,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';

/**
 * @see https://github.com/typeorm/typeorm/issues/2390
 */
const transformFromTimeToDatabaseType = (value: Time | FindOperator<any>) => {
  if (value instanceof FindOperator) {
    const oldOperator = value as unknown as { _value: Time };
    const newOperator = value as unknown as { _value: string };

    // eslint-disable-next-line no-underscore-dangle
    newOperator._value = oldOperator._value.toString();

    return newOperator;
  }

  return value.toString();
};

@Entity()
export class DefaultAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('time', {
    transformer: {
      from: Time.fromString,
      to: transformFromTimeToDatabaseType,
    },
  })
  from: Time;

  @Column('time', {
    transformer: {
      from: Time.fromString,
      to: transformFromTimeToDatabaseType,
    },
  })
  to: Time;

  @Column()
  dayOfWeek: number;

  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn()
  instructor: Instructor;
}
