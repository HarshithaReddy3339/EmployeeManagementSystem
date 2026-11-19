import { PrismaService } from '../prisma.service.js';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalEmployees: number;
        totalDepartments: number;
        employeesByDepartment: {
            department: string;
            count: number;
        }[];
        employeesByDesignation: {
            designation: string;
            count: number;
        }[];
        recentEmployees: ({
            user: {
                email: string;
            };
            department: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            phone: string;
            designation: string;
            departmentId: string;
            profileImage: string;
        })[];
    }>;
}
