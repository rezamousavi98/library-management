import { Injectable, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { ApiResponse } from 'src/common/models/api-response.model';
import { BaseFilterDto } from 'src/common/models/base-filter.model';
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

    async getBorrowings(getBorrowingDto: BaseFilterDto): Promise<ApiResponse<Borrowing[]>> {
        const {search, page, limit} = getBorrowingDto;
        const query = this.borrowingRepository
          .createQueryBuilder('borrowing')
          .leftJoin('borrowing.member', 'user')
          .addSelect(['user.nationalCode', 'user.fullName'])
          .leftJoin('borrowing.books', 'book').addSelect(['book.title', 'book.isbn']);
        const count = await query.getCount();

        // if (search) {
        //     query.andWhere('borrowing.date LIKE :search', {search: `%${search}%`});
        // }

        if (limit && page) {
            const offset = (page - 1) * limit;
            query.skip(offset).take(limit);
        }

        try {
            const borrowings = await query.getMany();
            return {
                results: borrowings,
                count
            }
        } catch(error) {
            throw new InternalServerErrorException();
        }

    }

    async getBorrowingById(id: number): Promise<Borrowing> {
        const query = this.borrowingRepository.createQueryBuilder('borrowing').where({id}).leftJoin('borrowing.member', 'user')
        .addSelect(['user.nationalCode', 'user.fullName'])
        .leftJoin('borrowing.books', 'book').addSelect(['book.title', 'book.isbn', 'book.id']);

        try {
            return await query.getOne();
        } catch(error) {
            throw new InternalServerErrorException();
        }
    }

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
