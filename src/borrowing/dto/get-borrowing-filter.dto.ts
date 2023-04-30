import { BaseFilterDto } from "src/common/models/base-filter.model";
import { BorrowingStatus } from "./borrowing-status.model";

export class GetBorrowingFilterDto extends BaseFilterDto {
    status?: BorrowingStatus;
    member?: string;
    order?: "DESC" | "ASC";
}