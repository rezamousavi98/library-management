import { Controller, Get } from "@nestjs/common";
import { ReportsService } from "./reports.service";

@Controller('api/reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}
    @Get()
    getReport() {
        return this.reportsService.getReport();
    }
}