import { Member } from "src/members/member.entity";

export interface Report {
    borrowing: number;
    totalBorrowing: number;
    borrowedBooks: number;
    members: number;
    overdue: number;
    summary: {
        member: string;
        books: string[];
    }[];
}