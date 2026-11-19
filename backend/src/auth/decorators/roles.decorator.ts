
import { SetMetadata } from '@nestjs/common';

export type Role = 'ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);

