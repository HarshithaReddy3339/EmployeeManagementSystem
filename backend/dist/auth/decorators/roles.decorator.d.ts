export type Role = 'ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
