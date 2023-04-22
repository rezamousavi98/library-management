import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse } from 'src/common/models/api-response.model';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMembersFilterDto } from './dto/get-members-filter.dto';
import { Member } from './member.entity';
import { MembersService } from './members.service';

@Controller('api/members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @Get()
    getMembers(@Query() getMembersFilterDto: GetMembersFilterDto): Promise<ApiResponse<Member[]>> {
        return this.membersService.getMembers(getMembersFilterDto);
    }

    @Post()
    createMember(@Body() member: CreateMemberDto): Promise<ApiResponse<Member>> {
        return this.membersService.createMember(member);
    }
}
