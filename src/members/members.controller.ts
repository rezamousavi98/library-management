import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse } from 'src/common/models/api-response.model';
import { BaseFilterDto } from 'src/common/models/base-filter.model';
import { CreateMemberDto } from './dto/create-member.dto';
import { SubscriptionRenewalDto } from './dto/subscription-renewal.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './member.entity';
import { MembersService } from './members.service';

@Controller('api/members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @Get()
    getMembers(@Query() getMembersFilterDto: BaseFilterDto): Promise<ApiResponse<Member[]>> {
        return this.membersService.getMembers(getMembersFilterDto);
    }

    @Get(':id')
    getMemberById(@Param('id') id: string): Promise<Member> {
        return this.membersService.getMemberById(id);
    }

    @Post()
    createMember(@Body() member: CreateMemberDto): Promise<Member> {
        return this.membersService.createMember(member);
    }

    @Patch(':id')
    updateMember(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<Member> {
        return this.membersService.updateMember(id, updateMemberDto);
    }

    @Patch(':id/subscription-renewal')
    renewalSubscription(@Param('id') id: string, @Body() renewalDto: SubscriptionRenewalDto): Promise<Member> {
        return this.membersService.renewalSubscription(id, renewalDto);
    }

    @Delete(':id')
    deleteMember(@Param('id') id: string): Promise<void> {
        return this.membersService.delete(id);
    }
}
