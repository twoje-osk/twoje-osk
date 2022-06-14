import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@osk/shared';
import * as bcrypt from 'bcrypt';
import { Organization } from 'organizations/entities/organization.entity';
import { UsersService } from '../users/users.service';
import { RequestUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    organization: Organization,
  ) {
    const user = await this.usersService.findOneByEmail(email, organization);

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  async login(user: RequestUser) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.userId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
