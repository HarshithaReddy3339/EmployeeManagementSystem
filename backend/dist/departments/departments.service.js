var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let DepartmentsService = class DepartmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const name = dto.name.trim();
        const existing = await this.prisma.department.findUnique({
            where: { name },
        });
        if (existing) {
            throw new ConflictException('Department already exists');
        }
        return this.prisma.department.create({
            data: {
                name,
                description: dto.description?.trim(),
            },
        });
    }
    async findAll() {
        return this.prisma.department.findMany({
            include: {
                _count: {
                    select: { employees: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { employees: true },
                },
            },
        });
        if (!department) {
            throw new NotFoundException('Department not found');
        }
        return department;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.name) {
            const existing = await this.prisma.department.findFirst({
                where: {
                    name: dto.name.trim(),
                    NOT: { id },
                },
            });
            if (existing) {
                throw new ConflictException('Department name already exists');
            }
        }
        return this.prisma.department.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name.trim() }),
                ...(dto.description !== undefined && {
                    description: dto.description.trim(),
                }),
            },
        });
    }
    async remove(id) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { employees: true },
                },
            },
        });
        if (!department) {
            throw new NotFoundException('Department not found');
        }
        if (department._count.employees > 0) {
            throw new ConflictException('Cannot delete a department that has employees assigned to it');
        }
        await this.prisma.department.delete({ where: { id } });
        return { message: 'Department deleted successfully' };
    }
};
DepartmentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DepartmentsService);
export { DepartmentsService };
//# sourceMappingURL=departments.service.js.map