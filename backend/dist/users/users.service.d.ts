import { PrismaService } from '../prisma.service.js';
import { CreateHrManagerDto } from './dto/create-hr-manager.dto.js';
import { UpdateHrManagerDto } from './dto/update-hr-manager.dto.js';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createHrManager(dto: CreateHrManagerDto): Promise<{
        message: string;
        user: {
            email: string;
            role: import("../generated/prisma/enums.js").Role;
            id: string;
            createdAt: Date;
        };
    }>;
    findAllHrManagers(): Promise<{
        email: string;
        role: import("../generated/prisma/enums.js").Role;
        id: string;
        createdAt: Date;
    }[]>;
    updateHrManager(id: string, dto: UpdateHrManagerDto): Promise<{
        message: string;
        user: {
            email: string;
            role: import("../generated/prisma/enums.js").Role;
            id: string;
            createdAt: Date;
        };
    }>;
    removeHrManager(id: string): Promise<{
        message: string;
    }>;
}
