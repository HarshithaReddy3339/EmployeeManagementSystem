import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto.js';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(dto: CreateEmployeeDto, file: Express.Multer.File): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../generated/prisma/enums.js").Role;
        };
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
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
    }>;
    findAll(page: number, limit: number, search?: string, departmentId?: string): Promise<{
        data: ({
            user: {
                email: string;
                role: import("../generated/prisma/enums.js").Role;
            };
            department: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyProfile(req: {
        user: {
            sub: string;
        };
    }): Promise<{
        user: {
            email: string;
            role: import("../generated/prisma/enums.js").Role;
            id: string;
        };
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
    }>;
    updateMyProfile(req: {
        user: {
            sub: string;
        };
    }, dto: UpdateMyProfileDto): Promise<{
        message: string;
        employee: {
            user: {
                email: string;
                role: import("../generated/prisma/enums.js").Role;
                id: string;
            };
            department: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
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
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            role: import("../generated/prisma/enums.js").Role;
            id: string;
            createdAt: Date;
        };
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
    }>;
    update(id: string, dto: UpdateEmployeeDto): Promise<{
        user: {
            email: string;
            role: import("../generated/prisma/enums.js").Role;
        };
        department: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
