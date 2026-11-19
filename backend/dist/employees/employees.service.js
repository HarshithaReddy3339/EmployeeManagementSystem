var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, BadRequestException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
let EmployeesService = class EmployeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, profileImage) {
        const email = dto.email.trim().toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }
        const department = await this.prisma.department.findUnique({
            where: { id: dto.departmentId },
        });
        if (!department) {
            throw new BadRequestException('Invalid department');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: 'EMPLOYEE',
                },
            });
            const employee = await tx.employee.create({
                data: {
                    userId: user.id,
                    firstName: dto.firstName.trim(),
                    lastName: dto.lastName.trim(),
                    phone: dto.phone.trim(),
                    designation: dto.designation.trim(),
                    profileImage,
                    departmentId: dto.departmentId,
                },
                include: {
                    department: true,
                },
            });
            return {
                ...employee,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            };
        });
    }
    async findAll(page = 1, limit = 10, search, departmentId) {
        const skip = (page - 1) * limit;
        const where = {
            ...(departmentId ? { departmentId } : {}),
            ...(search
                ? {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        {
                            user: {
                                email: { contains: search, mode: 'insensitive' },
                            },
                        },
                        {
                            designation: { contains: search, mode: 'insensitive' },
                        },
                    ],
                }
                : {}),
        };
        const [employees, total] = await this.prisma.$transaction([
            this.prisma.employee.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            email: true,
                            role: true,
                        },
                    },
                    department: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.employee.count({ where }),
        ]);
        return {
            data: employees,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
                department: true,
            },
        });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        return employee;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.departmentId) {
            const department = await this.prisma.department.findUnique({
                where: { id: dto.departmentId },
            });
            if (!department) {
                throw new BadRequestException('Invalid department');
            }
        }
        return this.prisma.employee.update({
            where: { id },
            data: {
                ...(dto.firstName !== undefined && {
                    firstName: dto.firstName.trim(),
                }),
                ...(dto.lastName !== undefined && {
                    lastName: dto.lastName.trim(),
                }),
                ...(dto.phone !== undefined && { phone: dto.phone.trim() }),
                ...(dto.designation !== undefined && {
                    designation: dto.designation.trim(),
                }),
                ...(dto.departmentId !== undefined && {
                    departmentId: dto.departmentId,
                }),
            },
            include: {
                department: true,
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
        });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.employee.delete({
                where: { id },
            });
            await tx.user.delete({
                where: { id: employee.userId },
            });
        });
        if (employee.profileImage) {
            const imagePath = join(process.cwd(), employee.profileImage);
            try {
                await unlink(imagePath);
            }
            catch (error) {
                console.error('Could not delete profile image:', error);
            }
        }
        return {
            message: 'Employee deleted successfully',
        };
    }
    async getMyProfile(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
            include: {
                department: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        if (!employee) {
            throw new NotFoundException('Employee profile not found');
        }
        return employee;
    }
    async updateMyProfile(userId, dto) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        if (!employee) {
            throw new NotFoundException('Employee profile not found');
        }
        const updatedEmployee = await this.prisma.employee.update({
            where: { userId },
            data: {
                ...(dto.firstName !== undefined && {
                    firstName: dto.firstName.trim(),
                }),
                ...(dto.lastName !== undefined && {
                    lastName: dto.lastName.trim(),
                }),
                ...(dto.phone !== undefined && {
                    phone: dto.phone.trim(),
                }),
            },
            include: {
                department: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return {
            message: 'Profile updated successfully',
            employee: updatedEmployee,
        };
    }
};
EmployeesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], EmployeesService);
export { EmployeesService };
//# sourceMappingURL=employees.service.js.map