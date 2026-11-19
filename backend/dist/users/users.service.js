var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, NotFoundException, BadRequestException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createHrManager(dto) {
        const email = dto.email.trim().toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                role: 'HR_MANAGER',
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return {
            message: 'HR Manager account created successfully',
            user,
        };
    }
    async findAllHrManagers() {
        return this.prisma.user.findMany({
            where: {
                role: 'HR_MANAGER',
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateHrManager(id, dto) {
        const manager = await this.prisma.user.findFirst({
            where: {
                id,
                role: 'HR_MANAGER',
            },
        });
        if (!manager) {
            throw new NotFoundException('HR Manager not found');
        }
        const data = {};
        if (dto.email) {
            const email = dto.email.trim().toLowerCase();
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email already exists');
            }
            data.email = email;
        }
        if (dto.password) {
            data.passwordHash = await bcrypt.hash(dto.password, 12);
        }
        if (Object.keys(data).length === 0) {
            throw new BadRequestException('Provide an email or password to update');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return {
            message: 'HR Manager updated successfully',
            user: updatedUser,
        };
    }
    async removeHrManager(id) {
        const manager = await this.prisma.user.findFirst({
            where: {
                id,
                role: 'HR_MANAGER',
            },
        });
        if (!manager) {
            throw new NotFoundException('HR Manager not found');
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return {
            message: 'HR Manager deleted successfully',
        };
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map