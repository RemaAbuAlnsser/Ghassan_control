import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async hasAnyUser(): Promise<boolean> {
    return (await this.usersRepository.count()) > 0;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.usersRepository.create({
      username: dto.username,
      password: hashedPassword,
    });

    try {
      const saved = await this.usersRepository.save(user);
      return this.findOne(saved.id);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('اسم المستخدم مستخدم مسبقاً');
      }
      throw error;
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: { id: true, username: true, password: true },
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    const data: Partial<User> = {};
    if (dto.username !== undefined) data.username = dto.username;
    if (dto.password) data.password = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      await this.usersRepository.update(id, data);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as unknown as { code?: string }).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('اسم المستخدم مستخدم مسبقاً');
      }
      throw error;
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    const totalUsers = await this.usersRepository.count();
    if (totalUsers <= 1) {
      throw new ConflictException(
        'لا يمكن حذف آخر مستخدم، يجب أن يبقى مستخدم واحد على الأقل',
      );
    }

    await this.usersRepository.remove(user);
  }
}
