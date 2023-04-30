import { IsNotEmpty } from "class-validator";

export class CloseBorrowingDto {
    @IsNotEmpty()
    returnedDate: Date;
}