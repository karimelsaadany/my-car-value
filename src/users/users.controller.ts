import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Serialize } from 'src/common/interceptor/serializer.interceptor';
import { UserDto } from './dto/user.dto';
import { AccessTokenGuard } from 'src/common/guard';

@Controller('users')
@UseGuards(AccessTokenGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    if (!user) throw new BadRequestException('User already exists');

    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User does not exist');
    
    return user;
  }
  
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) throw new NotFoundException('User does not exist');

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.remove(id);
    if (!user) throw new NotFoundException('User does not exist');

    return user;
  }
}
