import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}