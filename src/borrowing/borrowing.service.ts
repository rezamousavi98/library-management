import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { MembersService } from 'src/members/members.service';
import { Repository } from 'typeorm';
import { Borrowing } from './borrowing.entity';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@Injectable()
export class BorrowingService {
    constructor(
        @InjectRepository(Borrowing)
        private borrowingRepository: Repository<Borrowing>,
        private bookService: BooksService,
        private memberService: MembersService,
    ) {}

    async createBorrowing(createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
        const {books, member, returnDate} = createBorrowingDto;
        const borroingMember = await this.memberService.getMemberById(member);
        const borrowingBooks = await this.bookService.getBorrowingBooks(Array.isArray(books) ? books : [books]);

        const borrowing = this.borrowingRepository.create({
            books: borrowingBooks,
            member: borroingMember,
            returnDate,
        });

        await this.borrowingRepository.save(borrowing);
        return borrowing;
    }
}
