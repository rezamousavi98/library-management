import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Subject } from "./subject.model";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(13, {message: 'isbn should has 13 characters.'})
    @MaxLength(13, {message: 'isbn should has 13 characters.'})
    isbn: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    language: string;

    translator: string;

    @IsNotEmpty()
    @IsString()
    publisher: string;

    @IsNotEmpty()
    @IsString()
    publicationDate: string;

    @IsNotEmpty()
    @IsString()
    subject: Subject;

    @IsNotEmpty()
    pagesCount: number;

    @IsNotEmpty()
    count: number;
}