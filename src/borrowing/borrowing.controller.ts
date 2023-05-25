import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common/decorators';
import { ApiResponse } from 'src/common/models/api-response.model';
import { Borrowing } from './borrowing.entity';
import { BorrowingService } from './borrowing.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { GetBorrowingFilterDto } from './dto/get-borrowing-filter.dto';
import { CloseBorrowingDto } from './dto/update-borrowing.dto';

@Controller('api/borrowing')
export class BorrowingController {
    constructor(private borrowingService: BorrowingService) {}

    @Get()
    getBorrowings(@Query() getBorrowingFilterDto: GetBorrowingFilterDto): Promise<ApiResponse<Borrowing[]>> {
        return this.borrowingService.getBorrowings(getBorrowingFilterDto);
    }

    @Get(':id')
    getBorrowingById(@Param('id') id: number): Promise<Borrowing> {
        return this.borrowingService.getBorrowingById(id);
    }

    @Post(':id/debt')
    getDebt(@Param('id') id: number, @Body() closeBorrowingDto: CloseBorrowingDto): Promise<number> {
        return this.borrowingService.getDebt(id, closeBorrowingDto);
    }

    @Post()
    createBorrowing(@Body() createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
        return this.borrowingService.createBorrowing(createBorrowingDto);
    }

    @Patch(':id/close')
    updateBorrowing(@Param('id') id: number, @Body() updateBorrowingDto: CloseBorrowingDto): Promise<Borrowing> {
        return this.borrowingService.updateBorrowing(id, updateBorrowingDto);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.borrowingService.delete(id);
    }
}
