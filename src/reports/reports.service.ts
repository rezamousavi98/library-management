import { Injectable } from "@nestjs/common";
import { BorrowingService } from "src/borrowing/borrowing.service";
import { MembersService } from "src/members/members.service";
import { Report } from "./dto/get-report.model";

@Injectable()
export class ReportsService {
    constructor(
        private borrowingService: BorrowingService,
        private membersService: MembersService
    ) {}

    async getReport(): Promise<Report> {
        const borrowing = await (await this.borrowingService.getBorrowings({})).results;
        const onGoingBorrowing = borrowing.filter(b => b.status === 1);
        const members = await (await this.membersService.getMembers({})).count;
        const overdue = onGoingBorrowing.filter(b => b.returnDate.getTime() <= new Date().getTime());
        const uniqueBooks = [];
        const summary = [];
        onGoingBorrowing.forEach(borrow => {
            borrow.books.forEach(book => {
                if (!uniqueBooks.find(b => b.id === book.id)) {
                    uniqueBooks.push(book);
                }
            })
            summary.push({
                member: borrow.member.fullName,
                books: borrow.books.map(book => book.title)
            })
        });
        const report: Report = {
            totalBorrowing: borrowing.length,
            borrowing: onGoingBorrowing.length,
            overdue: overdue.length,
            members,
            borrowedBooks: uniqueBooks.length,
            summary
        };

        return report;
    }
}