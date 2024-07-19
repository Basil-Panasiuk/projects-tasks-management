import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
