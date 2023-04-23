import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Subject } from "./dto/subject.model";

@Entity()
export class Book {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    isbn: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    language: string;

    @Column({nullable: true})
    translator: string;

    @Column()
    publisher: string;

    @Column()
    publicationDate: string;

    @Column()
    subject: Subject;

    @Column()
    pagesCount: number;

    @Column()
    count: number;

    @Column({default: 0})
    inTrust: number;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}