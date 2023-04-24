import { IsNotEmpty } from "class-validator";

export class CreateBorrowingDto {
    @IsNotEmpty()
    books: number[];

    @IsNotEmpty()
    member: string;

    @IsNotEmpty()
    returnDate: Date;
}