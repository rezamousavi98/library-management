import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { Borrowing } from './borrowing.entity';
import { BorrowingService } from './borrowing.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@Controller('api/borrowing')
export class BorrowingController {
    constructor(private borrowingService: BorrowingService) {}

    @Post()
    createBorrowing(@Body() createBorrowingDto: CreateBorrowingDto): Promise<Borrowing> {
        return this.borrowingService.createBorrowing(createBorrowingDto);
    }
}
