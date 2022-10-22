import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto
    const userExists = await this.findOneByEmail(email);
    if (userExists) return;

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = this.usersRepository.create({ email, password: hashedPassword });

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return;

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return;
    
    await this.usersRepository.remove(user);

    return {
      ...user,
      id
    };
  }
}
