import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/models/api-response.model';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { GetMembersFilterDto } from './dto/get-members-filter.dto';
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

        // const members = await query
        //   .leftJoin('project.po', 'userTable')
        //   .addSelect([
        //     'userTable.username',
        //     'userTable.firstName',
        //     'userTable.lastName',
        //   ])
        //   .leftJoin('project.members', 'user')
        //   .addSelect(['user.username', 'user.firstName', 'user.lastName'])
        //   .getMany();
        const members = await query.getMany();

        return {
            results: members,
            count,
        };
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
}
