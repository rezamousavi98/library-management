import { Borrowing } from "src/borrowing/borrowing.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Member {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({unique: true})
    nationalCode: string;

    @Column()
    fullName: string;

    @Column()
    mobile: string;

    @Column()
    address: string;

    @CreateDateColumn({type: 'timestamptz'})
    registeredAt: Date;

    @Column({type: 'timestamptz'})
    registrationExpiry: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;

    @OneToMany(_type => Borrowing, borrowing => borrowing.member, {eager: false})
    borrowingList: Borrowing[];
}