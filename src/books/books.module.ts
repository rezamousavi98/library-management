import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Borrowing } from 'src/borrowing/borrowing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Borrowing])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
