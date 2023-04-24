import { Book } from "src/books/book.entity";
import { Member } from "src/members/member.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BorrowingStatus } from "./dto/borrowing-status.model";

@Entity()
export class Borrowing {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToMany(_type => Book, book => book.borrowList, { eager: true })
    @JoinTable()
    books: Book[];

    @ManyToOne(_type => Member, member => member.borrowingList, {eager: true})
    member: Member;

    @CreateDateColumn({type: 'timestamptz'})
    date: Date;

    @Column({type: 'timestamptz'})
    returnDate: Date;

    @Column({type: 'timestamptz', nullable: true})
    returnedDate: Date;

    @Column({ default: 1 })
    status: BorrowingStatus;
}