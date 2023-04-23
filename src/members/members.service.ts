import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/models/api-response.model';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMembersFilterDto } from './dto/get-members-filter.dto';
import { SubscriptionRenewalDto } from './dto/subscription-renewal.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './member.entity';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
    ) { }

    async getMembers(
        getMembersDto: GetMembersFilterDto,
    ): Promise<ApiResponse<Member[]>> {
        const { search, limit, page } = getMembersDto;
        const query = this.memberRepository.createQueryBuilder('member');
        let count = await query.getCount();

        if (search) {
            query.andWhere(
                '(LOWER(member.fullName) LIKE LOWER(:search) OR member.nationalCode LIKE :search OR member.mobile LIKE :search)',
                { search: `%${search}%` },
            );
            count = await query.getCount();
        }

        if (limit && page) {
            const offset = (page - 1) * limit;
            query.skip(offset).take(limit);
        }

        const members = await query.getMany();

        return {
            results: members,
            count,
        };
    }

    async getMemberById(id: string): Promise<Member> {
        const member = await this.memberRepository.findOne({
            where: { nationalCode: id }
        });

        if (member) {
            return member;
        } else {
            throw new NotFoundException(`Member with national code ${id} not found.`)
        }
    }

    async createMember(
        createMemberDto: CreateMemberDto,
    ): Promise<ApiResponse<Member>> {
        const member = this.memberRepository.create(createMemberDto);
        await this.memberRepository.save(member);
        return {
            results: member,
        };
    }

    async updateMember(nationalCode: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
        const {fullName, address, mobile} = updateMemberDto;
        const member = await this.getMemberById(nationalCode);
        
        member.fullName = fullName;
        member.address = address;
        member.mobile = mobile;
        this.memberRepository.save(member);

        return member;
    }

    async renewalSubscription(nationalCode: string, renewalDto: SubscriptionRenewalDto): Promise<Member> {
        const member = await this.getMemberById(nationalCode);
        member.registrationExpiry = renewalDto.expiryDate;
        this.memberRepository.save(member);

        return member;
    } 

    async delete(nationalCode: string): Promise<void> {
        const result = await this.memberRepository.delete({nationalCode});
        
        if (result.affected === 0) {
            throw new NotFoundException(`Member with National code ${nationalCode} not found.`);
        }
    }
}
