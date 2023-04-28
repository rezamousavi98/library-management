import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Query } from '@nestjs/common/decorators';
import { ApiResponse } from 'src/common/models/api-response.model';
import { BaseFilterDto } from 'src/common/models/base-filter.model';
import { Borrowing } from './borrowing.entity';
import { BorrowingService } from './borrowing.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@Controller('api/borrowing')
export class BorrowingController {
    constructor(private borrowingService: BorrowingService) {}

    @Get()
    getBorrowings(@Query() getBorrowingFilterDto: BaseFilterDto): Promise<ApiResponse<Borrowing[]>> {
        return this.borrowingService.getBorrowings(getBorrowingFilterDto);
    }

    @Get(':id')
    getBorrowingById(@Param('id') id: number): Promise<Borrowing> {
        return this.borrowingService.getBorrowingById(id);
    }

    @Post()
    createBorrowing(@Body() createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
        return this.borrowingService.createBorrowing(createBorrowingDto);
    }
}
