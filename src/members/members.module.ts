import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Borrowing } from 'src/borrowing/borrowing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Borrowing])
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
