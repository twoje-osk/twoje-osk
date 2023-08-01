import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '@osk/shared';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RequestOrganization } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(
    email: string,
    password: string,
    organization: RequestOrganization,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email, organization, isActive: true },
      relations: {
        trainee: true,
        instructor: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.validateUserByEntity(user, password);
  }

  async validateUserByEntity(user: User, password: string) {
    if (user.password === null) {
      return null;
    }

    const isPasswordCorrect = await argon.verify(user.password, password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
