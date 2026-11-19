import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, response: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("../generated/prisma/enums.js").Role;
        };
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("../generated/prisma/enums.js").Role;
        };
    }>;
    logout(request: Request, response: Response): Promise<{
        message: string;
    }>;
    getProfile(request: Request & {
        user: {
            sub: string;
        };
    }): Promise<{
        email: string;
        role: import("../generated/prisma/enums.js").Role;
        id: string;
        createdAt: Date;
    }>;
}
