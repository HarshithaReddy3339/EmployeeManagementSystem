
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

interface AccessPayload {
  sub: string;
  email: string;
  role: string;
  sid: string;
}

interface RefreshPayload {
  sub: string;
  sid: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getSecret(name: string): string {
    const secret = process.env[name];

    if (!secret) {
      throw new InternalServerErrorException(
        `${name} is not configured`,
      );
    }

    return secret;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async createTokens(
    user: { id: string; email: string; role: string },
    sessionId: string,
  ) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        sid: sessionId,
      },
      {
        secret: this.getSecret('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        sid: sessionId,
      },
      {
        secret: this.getSecret('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
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

  async refresh(refreshToken: string) {
    let payload: RefreshPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshPayload>(
        refreshToken,
        { secret: this.getSecret('JWT_REFRESH_SECRET') },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
      include: { user: true },
    });

    if (
      !session ||
      session.userId !== payload.sub ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      session.refreshTokenHash !== this.hashToken(refreshToken)
    ) {
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

  async logout(refreshToken?: string) {
    if (refreshToken) {
      try {
        const payload =
          await this.jwtService.verifyAsync<RefreshPayload>(
            refreshToken,
            {
              secret: this.getSecret('JWT_REFRESH_SECRET'),
              ignoreExpiration: true,
            },
          );

        await this.prisma.session.updateMany({
          where: {
            id: payload.sid,
            userId: payload.sub,
            revokedAt: null,
          },
          data: { revokedAt: new Date() },
        });
      } catch {
        // Invalid or missing token: logout remains safe and idempotent.
      }
    }

    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
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

  async validateAccessToken(token: string) {
  const payload = await this.jwtService.verifyAsync<AccessPayload>(
    token,
    {
      secret: this.getSecret('JWT_ACCESS_SECRET'),
    },
  );

  const session = await this.prisma.session.findUnique({
    where: { id: payload.sid },
  });

  if (
    !session ||
    session.userId !== payload.sub ||
    session.revokedAt ||
    session.expiresAt <= new Date()
  ) {
    throw new UnauthorizedException('Session is invalid or expired');
  }

  return payload;
}
}
