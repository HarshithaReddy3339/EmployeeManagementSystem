
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlink } from 'fs/promises';

import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles('ADMIN', 'HR_MANAGER')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }

    const profileImage = `uploads/profiles/${file.filename}`;

    try {
      return await this.employeesService.create(dto, profileImage);
    } catch (error) {
      try {
        await unlink(join(process.cwd(), profileImage));
      } catch (cleanupError) {
        console.error('Could not remove uploaded image:', cleanupError);
      }

      throw error;
    }
  }

  @Get()
  @Roles('ADMIN', 'HR_MANAGER')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid pagination values');
    }

    return this.employeesService.findAll(page, limit, search, departmentId);
  }

  @Get('me')
  @Roles('EMPLOYEE')
  getMyProfile(@Req() req: { user: { sub: string } }) {
    return this.employeesService.getMyProfile(req.user.sub);
  }

  @Patch('me')
  @Roles('EMPLOYEE')
  updateMyProfile(
    @Req() req: { user: { sub: string } },
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.employeesService.updateMyProfile(req.user.sub, dto);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR_MANAGER')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR_MANAGER')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
