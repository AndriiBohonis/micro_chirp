import { UserModel } from '@/common/models/user.model';

export interface AuthModel {
  access_token: string;
  user: UserModel;
}
