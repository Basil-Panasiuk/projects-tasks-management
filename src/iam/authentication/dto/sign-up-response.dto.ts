import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({ example: 'New user successfully registered' })
  message: string;

  @ApiProperty({ example: '6698c19f71665c7a97207266' })
  userId: string;
}
