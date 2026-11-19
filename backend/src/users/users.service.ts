
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service.js';
import { CreateHrManagerDto } from './dto/create-hr-manager.dto.js';
import { UpdateHrManagerDto } from './dto/update-hr-manager.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createHrManager(dto: CreateHrManagerDto) {
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
async updateHrManager(id: string, dto: UpdateHrManagerDto) {
  const manager = await this.prisma.user.findFirst({
    where: {
      id,
      role: 'HR_MANAGER',
    },
  });

  if (!manager) {
    throw new NotFoundException('HR Manager not found');
  }

  const data: {
    email?: string;
    passwordHash?: string;
  } = {};

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

async removeHrManager(id: string) {
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
}
