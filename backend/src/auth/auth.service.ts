import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '@osk/shared';
import * as bcrypt from 'bcrypt';
import { Organization } from 'organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';

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
    organization: Organization,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email, organization, isActive: true },
    });

    if (!user || user.password === null) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

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
