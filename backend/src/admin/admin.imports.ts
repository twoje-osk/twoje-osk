import { Instructor } from 'instructors/entities/instructor.entity.admin';
import { User } from 'users/entities/user.entity.admin';
import { Organization } from 'organizations/entities/organization.entity.admin';
import { Vehicle } from 'vehicles/entities/vehicle.entity.admin';
import { Trainee } from 'trainees/entities/trainee.entity.admin';

export const resources = [Instructor, User, Organization, Vehicle, Trainee];
