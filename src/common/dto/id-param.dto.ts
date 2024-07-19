import { IsNotEmpty } from 'class-validator';

export class IdParamDto {
  @IsNotEmpty({ message: 'id:The id param is required' })
  id: string;
}
