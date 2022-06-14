import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { CurrentUserModule } from 'current-user/current-user.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]), CurrentUserModule],
  providers: [UsersService, CurrentUserService],
})
export class UsersModule {}
