import { Injectable, NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { ApiResponse } from 'src/common/models/api-response.model';
import { MembersService } from 'src/members/members.service';
import { Repository } from 'typeorm';
import { Borrowing } from './borrowing.entity';
import { BorrowingStatus } from './dto/borrowing-status.model';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { GetBorrowingFilterDto } from './dto/get-borrowing-filter.dto';
import { CloseBorrowingDto } from './dto/update-borrowing.dto';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingRepository: Repository<Borrowing>,
    private bookService: BooksService,
    private memberService: MembersService,
  ) {}

  async getBorrowings(
    getBorrowingDto: GetBorrowingFilterDto,
  ): Promise<ApiResponse<Borrowing[]>> {
    const { page, limit, status, member: memberId, order } = getBorrowingDto;
    const query = this.borrowingRepository
      .createQueryBuilder('borrowing')
      .leftJoin('borrowing.member', 'user')
      .addSelect(['user.nationalCode', 'user.fullName'])
      .leftJoin('borrowing.books', 'book')
      .addSelect(['book.title', 'book.isbn']);
    let count = await query.getCount();

    if (memberId) {
      const foundedMember = await this.memberService.getMemberById(memberId);
      query.where({member: foundedMember});
      count = await query.getCount();
    }

    if (status) {
        query.andWhere('borrowing.status = :status', {
          status: BorrowingStatus[status],
        });
        count = await query.getCount();
    }

    if (limit && page) {
      const offset = (page - 1) * limit;
      query.skip(offset).take(limit);
    }

    try {
      const borrowings = await query.orderBy('borrowing.date', order ?? "DESC").getMany();
      return {
        results: borrowings,
        count,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getBorrowingById(id: number): Promise<Borrowing> {
    const query = this.borrowingRepository
      .createQueryBuilder('borrowing')
      .where({ id })
      .leftJoin('borrowing.member', 'user')
      .addSelect(['user.nationalCode', 'user.fullName'])
      .leftJoin('borrowing.books', 'book')
      .addSelect(['book.title', 'book.isbn', 'book.id']);

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createBorrowing(
    createBorrowingDto: CreateBorrowingDto,
  ): Promise<Borrowing> {
    const { books, member, returnDate } = createBorrowingDto;
    const borroingMember = await this.memberService.getMemberById(member);
    const borrowingBooks = await this.bookService.getBorrowingBooks(
      Array.isArray(books) ? books : [books],
    );

    const borrowing = this.borrowingRepository.create({
      books: borrowingBooks,
      member: borroingMember,
      returnDate,
    });

    await this.borrowingRepository.save(borrowing);
    return borrowing;
  }

  async updateBorrowing(
    id: number,
    updateBorrowingDto: CloseBorrowingDto,
  ): Promise<Borrowing> {
    const borrowing = await this.getBorrowingById(id);
    if (borrowing.status === 1) {
      borrowing.returnedDate = updateBorrowingDto.returnedDate;
      borrowing.status = 0;
      try {
        const updateooks = await this.bookService.updateInTrustCount(
          borrowing.books.map((book) => book.id),
          'decrease',
        );
        if (updateooks.affected === borrowing.books.length) {
          await this.borrowingRepository.save(borrowing);
          return borrowing;
        } else {
          throw new InternalServerErrorException();
        }
      } catch (error) {
        throw new InternalServerErrorException();
      }
    } else {
      throw new InternalServerErrorException(
        'You can not edit closed borrowings.',
      );
    }
  }

  async getDebt(id: number, closeBorrowingDto: CloseBorrowingDto): Promise<number> {
    const borrowing = await this.getBorrowingById(id);
    const { returnedDate } = closeBorrowingDto;
    const delay = borrowing.returnDate.getTime() - new Date(returnedDate).getTime();
    if (delay >= 0 || borrowing.status === 0) {
      return 0;
    } else {
      const days = Math.ceil((delay * -1) / 86400000);
      return days * 4200;
    }
  }

  async delete(id: number): Promise<void> {
    const borrowing = await this.getBorrowingById(id);
    if (borrowing.status === 1) {
      try {
        const updateBooks = await this.bookService.updateInTrustCount(
          borrowing.books.map((book) => book.id),
          'decrease',
        );
        if (updateBooks.affected === borrowing.books.length) {
          const result = await this.borrowingRepository.delete({ id });
          if (result.affected === 0)
            throw new NotFoundException(`borrowing with id${id} not exist`);
        }
      } catch (error) {
        throw new InternalServerErrorException();
      }
    } else {
      throw new InternalServerErrorException(
        'You can not delete closed borrowings.',
      );
    }
  }
}
