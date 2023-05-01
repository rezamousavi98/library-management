import { BaseFilterDto } from "src/common/models/base-filter.model";
import { BorrowingStatus } from "./borrowing-status.model";

export class GetBorrowingFilterDto extends BaseFilterDto {
    status?: BorrowingStatus;
    memberId?: string;
    bookId?: number;
    order?: "DESC" | "ASC";
}