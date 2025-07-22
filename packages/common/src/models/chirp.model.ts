import { BaseModel } from '@/common/models/base.model';
import { UserModel } from '@/common/models/user.model';

export type ChirpModel = BaseModel & {
  user_id: number;
  user: Pick<UserModel, 'id' | 'username' | 'first_name' | 'last_name'>;
  title: string;
  content: string;
};
