import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
interface AccessPayload {
    sub: string;
    email: string;
    role: string;
    sid: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private getSecret;
    private hashToken;
    private createTokens;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("../generated/prisma/enums.js").Role;
        };
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("../generated/prisma/enums.js").Role;
        };
    }>;
    logout(refreshToken?: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        role: import("../generated/prisma/enums.js").Role;
        id: string;
        createdAt: Date;
    }>;
    validateAccessToken(token: string): Promise<AccessPayload>;
}
export {};
