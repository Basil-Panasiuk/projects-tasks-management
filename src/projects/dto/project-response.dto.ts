import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  createdBy: UserResponseDto;
}
