import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateMemberDto {
    @IsNotEmpty()
    @MinLength(10, { message: 'national code should contain 10 characters.'})
    @MaxLength(10, { message: 'national code should contain 10 characters.'})
    nationalCode: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11, { message: 'national code should contain 11 characters.'})
    @MaxLength(11, { message: 'national code should contain 11 characters.'})
    mobile: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    registrationExpiry: Date;
}