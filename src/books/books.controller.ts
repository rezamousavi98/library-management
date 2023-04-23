import { Body, Controller, Get, Param, Post, Delete, Query, Put } from '@nestjs/common';
import { ApiResponse } from 'src/common/models/api-response.model';
import { BaseFilterDto } from 'src/common/models/base-filter.model';
import { Book } from './book.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('api/books')
export class BooksController {
    constructor(private bookService: BooksService) {}

    @Get()
    getBooks(@Query() getBooksFilterDto: BaseFilterDto): Promise<ApiResponse<Book[]>> {
        return this.bookService.getBooks(getBooksFilterDto);
    }

    @Get(':id')
    getBookById(@Param('id') id: number): Promise<Book> {
        return this.bookService.getBookById(id);
    }

    @Post()
    createBook(@Body() book: CreateBookDto): Promise<Book> {
        return this.bookService.createBook(book);
    }

    @Put(':id')
    updateBook(@Param('id') id: number, @Body() book: CreateBookDto): Promise<Book> {
        return this.bookService.updateBook(id, book);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.bookService.delete(id);
    }
}
