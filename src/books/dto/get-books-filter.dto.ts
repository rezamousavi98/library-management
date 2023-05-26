import { BaseFilterDto } from "src/common/models/base-filter.model";

export class GetBooksFilterDto extends BaseFilterDto {
    search?: string;
    limit?: number;
    page?: number;
    status?: "available" | "onLoan";
}