import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, ListUsersDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserDto)
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

  findOne(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
