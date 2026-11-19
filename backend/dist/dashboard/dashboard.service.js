var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [totalEmployees, totalDepartments, departmentCounts, designationCounts, recentEmployees,] = await Promise.all([
            this.prisma.employee.count(),
            this.prisma.department.count(),
            this.prisma.employee.groupBy({
                by: ['departmentId'],
                _count: { _all: true },
            }),
            this.prisma.employee.groupBy({
                by: ['designation'],
                _count: { _all: true },
            }),
            this.prisma.employee.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    department: {
                        select: { name: true },
                    },
                    user: {
                        select: { email: true },
                    },
                },
            }),
        ]);
        const departments = await this.prisma.department.findMany({
            select: { id: true, name: true },
        });
        const departmentMap = new Map(departments.map((department) => [department.id, department.name]));
        return {
            totalEmployees,
            totalDepartments,
            employeesByDepartment: departmentCounts.map((item) => ({
                department: departmentMap.get(item.departmentId) ?? 'Unknown',
                count: item._count._all,
            })),
            employeesByDesignation: designationCounts.map((item) => ({
                designation: item.designation,
                count: item._count._all,
            })),
            recentEmployees,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map