import { UserRole } from '../enums';

export class LoginAdminResponse {
  accessToken: string;
  refreshToken: string;
  account: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  };
}

export class LoginAdminRequest {
  email: string;
  password: string;
}
