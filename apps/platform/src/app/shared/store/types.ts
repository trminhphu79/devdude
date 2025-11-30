import { LoginAdminResponse } from '@devdude/common/types';

export type AdminAuthState = Omit<LoginAdminResponse, 'refreshToken'>;
