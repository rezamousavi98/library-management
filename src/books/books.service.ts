import { Injectable } from '@nestjs/common';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/models/api-response.model';
import { Repository, UpdateResult } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { GetBooksFilterDto } from './dto/get-books-filter.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  throwNotFoundException(id: number) {
    throw new NotFoundException(`Book with id ${id} not found.`);
  }

  async getBooks(
    getBooksFilterDto: GetBooksFilterDto,
  ): Promise<ApiResponse<Book[]>> {
    const { search, limit, page, status } = getBooksFilterDto;
    const query = this.bookRepository.createQueryBuilder('book');
    let count = await query.getCount();

    if (search) {
      query.andWhere(
        '(LOWER(book.title) LIKE LOWER(:search) OR LOWER(book.author) LIKE LOWER(:search) OR LOWER(book.publisher) LIKE LOWER(:search) OR book.isbn LIKE :search)',
        { search: `%${search}%` },
      );
      count = await query.getCount();
    }

    if (limit && page) {
      const offset = (page - 1) * limit;
      query.skip(offset).take(limit);
    }

    let books = await query.getMany();

    if (status) {
      if (status === "available") {
        books = books.filter(book => book.count - book.onLoan > 0);
      } else if (status === "onLoan") {
        books = books.filter(book => book.count - book.onLoan === 0);
      }
      count = books.length;
    }

    return {
      results: books,
      count,
    };
  }

  async getBorrowingBooks(booksId: number[]): Promise<Book[]> {
    const query = this.bookRepository
    .createQueryBuilder('book')
    .where('book.id IN (:...id)', { id: booksId });

    const requestedBooks = await query.getMany();

    const unAvailableBooks = requestedBooks.filter(b => b.count - b.onLoan === 0);
    if (unAvailableBooks.length) {
      throw new NotFoundException(`These books are in trust: ${unAvailableBooks.map(b => b.title).join(' | ')}`);
    } else {
      const result = await this.updateOnLoanCount(booksId, "increase");
      if (result.affected === booksId.length) {
        requestedBooks.forEach(book => book.onLoan += 1);
        return requestedBooks;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateOnLoanCount(booksId: number[], action: "increase" | "decrease"): Promise<UpdateResult> {
    return await this.bookRepository
    .createQueryBuilder('book')
    .update(Book)
    .set({ onLoan: () => action === "increase" ? 'onLoan + 1' : 'onLoan - 1' })
    .where('book.id IN (:...id)', { id: booksId })
    .execute();
  }

  async getBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (book) {
      return book;
    } else {
      this.throwNotFoundException(id);
    }
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    await this.bookRepository.save(book);
    return book;
  }

  async updateBook(id: number, updateBookDto: CreateBookDto): Promise<Book> {
    const book = await this.getBookById(id);
    const {
      author,
      count,
      isbn,
      language,
      pagesCount,
      publicationDate,
      publisher,
      subject,
      title,
      translator,
    } = updateBookDto;

    book.isbn = isbn;
    book.title = title;
    book.author = author;
    book.language = language;
    book.publisher = publisher;
    book.publicationDate = publicationDate;
    book.subject = subject;
    book.pagesCount = pagesCount;
    book.count = count;
    book.translator = translator ?? null;

    await this.bookRepository.save(book);
    return book;
  }

  async delete(id: number): Promise<void> {
    const result = await this.bookRepository.delete({ id });
    if (result.affected === 0) this.throwNotFoundException(id);
  }
}
