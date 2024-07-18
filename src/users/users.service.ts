import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException({
        message: `User #${id} not found`,
      });
    }
    return user;
  }

  toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
