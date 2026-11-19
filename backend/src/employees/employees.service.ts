import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto.js';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto, profileImage: string) {
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

    // Create User and Employee together.
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

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    departmentId?: string,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      ...(departmentId ? { departmentId } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              {
                user: {
                  email: { contains: search, mode: 'insensitive' as const },
                },
              },
              {
                designation: { contains: search, mode: 'insensitive' as const },
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

  async findOne(id: string) {
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

  async update(id: string, dto: UpdateEmployeeDto) {
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

  async remove(id: string) {
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

  // Delete the profile image from the uploads folder
  if (employee.profileImage) {
    const imagePath = join(process.cwd(), employee.profileImage);

    try {
      await unlink(imagePath);
    } catch (error) {
      console.error('Could not delete profile image:', error);
    }
  }

  return {
    message: 'Employee deleted successfully',
  };
}

async getMyProfile(userId: string) {
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
async updateMyProfile(userId: string, dto: UpdateMyProfileDto) {
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
}
