import { Matches } from 'class-validator';
import { ObjectIdPattern } from '../common.constants';

export class IdParamDto {
  @Matches(ObjectIdPattern, {
    message: 'id:The ID is not valid',
  })
  id: string;
}
