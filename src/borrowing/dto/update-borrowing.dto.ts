import { IsNotEmpty } from "class-validator";

export class UpdateBorrowingDto {
    @IsNotEmpty()
    returnedDate: Date;
}