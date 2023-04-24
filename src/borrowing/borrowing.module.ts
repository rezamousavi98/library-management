import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrowing } from './borrowing.entity';
import { Book } from 'src/books/book.entity';
import { Member } from 'src/members/member.entity';
import { BooksService } from 'src/books/books.service';
import { MembersService } from 'src/members/members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing, Book, Member])],
  controllers: [BorrowingController],
  providers: [BorrowingService, BooksService, MembersService],
})
export class BorrowingModule {}
