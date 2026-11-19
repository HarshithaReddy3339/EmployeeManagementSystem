
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalEmployees,
      totalDepartments,
      departmentCounts,
      designationCounts,
      recentEmployees,
    ] = await Promise.all([
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

    const departmentMap = new Map(
      departments.map((department) => [department.id, department.name]),
    );

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
}
