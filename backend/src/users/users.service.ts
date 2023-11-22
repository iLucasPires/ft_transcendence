import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { FindOrCreateUserDto, ListUsersDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreate(findOrCreateUserDto: FindOrCreateUserDto): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .insert()
      .values(findOrCreateUserDto)
      .into(User)
      .orUpdate(["displayName", "username"], ["intraId", "email"])
      .returning("*")
      .execute()
      .then((result) => result.generatedMaps[0] as User);
  }

  findAll(listUsersDto: ListUsersDto): Promise<User[]> {
    return this.userRepository.find({
      skip: listUsersDto.offset,
      take: listUsersDto.limit,
    });
  }

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
