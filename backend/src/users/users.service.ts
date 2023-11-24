import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { FindOrCreateUserDto, ListUsersDto, UpdateUserDto } from "./dto";

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

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found: ${username}`);
    }

    const isUsernameTaken = await this.userRepository.exist({
      where: { username: updateUserDto.username },
    });

    if (isUsernameTaken) {
      throw new ConflictException(
        `Username already taken: ${updateUserDto.username}`,
      );
    }

    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .whereEntity(user)
      .returning("*")
      .execute()
      .then((result) => result.generatedMaps[0] as User);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
