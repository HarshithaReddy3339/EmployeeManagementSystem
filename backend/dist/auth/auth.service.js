var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, InternalServerErrorException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    getSecret(name) {
        const secret = process.env[name];
        if (!secret) {
            throw new InternalServerErrorException(`${name} is not configured`);
        }
        return secret;
    }
    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }
    async createTokens(user, sessionId) {
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
            sid: sessionId,
        }, {
            secret: this.getSecret('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync({
            sub: user.id,
            sid: sessionId,
        }, {
            secret: this.getSecret('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const sessionId = randomUUID();
        const tokens = await this.createTokens(user, sessionId);
        await this.prisma.session.create({
            data: {
                id: sessionId,
                userId: user.id,
                refreshTokenHash: this.hashToken(tokens.refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken: tokens.accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            refreshToken: tokens.refreshToken,
        };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, { secret: this.getSecret('JWT_REFRESH_SECRET') });
        }
        catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
        const session = await this.prisma.session.findUnique({
            where: { id: payload.sid },
            include: { user: true },
        });
        if (!session ||
            session.userId !== payload.sub ||
            session.revokedAt ||
            session.expiresAt <= new Date() ||
            session.refreshTokenHash !== this.hashToken(refreshToken)) {
            throw new UnauthorizedException('Session is invalid or expired');
        }
        const tokens = await this.createTokens(session.user, session.id);
        await this.prisma.session.update({
            where: { id: session.id },
            data: {
                refreshTokenHash: this.hashToken(tokens.refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
            },
        };
    }
    async logout(refreshToken) {
        if (refreshToken) {
            try {
                const payload = await this.jwtService.verifyAsync(refreshToken, {
                    secret: this.getSecret('JWT_REFRESH_SECRET'),
                    ignoreExpiration: true,
                });
                await this.prisma.session.updateMany({
                    where: {
                        id: payload.sid,
                        userId: payload.sub,
                        revokedAt: null,
                    },
                    data: { revokedAt: new Date() },
                });
            }
            catch {
            }
        }
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
    async validateAccessToken(token) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.getSecret('JWT_ACCESS_SECRET'),
        });
        const session = await this.prisma.session.findUnique({
            where: { id: payload.sid },
        });
        if (!session ||
            session.userId !== payload.sub ||
            session.revokedAt ||
            session.expiresAt <= new Date()) {
            throw new UnauthorizedException('Session is invalid or expired');
        }
        return payload;
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map