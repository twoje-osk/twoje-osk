import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
})
export class UsersModule {}
