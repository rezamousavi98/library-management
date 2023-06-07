import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/books/book.entity';
import { BooksService } from 'src/books/books.service';
import { Borrowing } from 'src/borrowing/borrowing.entity';
import { BorrowingService } from 'src/borrowing/borrowing.service';
import { Member } from 'src/members/member.entity';
import { MembersService } from 'src/members/members.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Borrowing, Book])
  ],
  controllers: [ReportsController],
  providers: [ReportsService, BorrowingService, BooksService, MembersService],
})
export class ReportsModule {}
