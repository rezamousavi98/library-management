import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateMemberDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11, { message: 'mobile number should contain 11 characters.'})
    @MaxLength(11, { message: 'mobile number should contain 11 characters.'})
    mobile: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}