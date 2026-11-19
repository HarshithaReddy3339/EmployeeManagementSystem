var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe, DefaultValuePipe, BadRequestException, Req, } from '@nestjs/common';
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
let EmployeesController = class EmployeesController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async create(dto, file) {
        if (!file) {
            throw new BadRequestException('Profile image is required');
        }
        const profileImage = `uploads/profiles/${file.filename}`;
        try {
            return await this.employeesService.create(dto, profileImage);
        }
        catch (error) {
            try {
                await unlink(join(process.cwd(), profileImage));
            }
            catch (cleanupError) {
                console.error('Could not remove uploaded image:', cleanupError);
            }
            throw error;
        }
    }
    findAll(page, limit, search, departmentId) {
        if (page < 1 || limit < 1 || limit > 100) {
            throw new BadRequestException('Invalid pagination values');
        }
        return this.employeesService.findAll(page, limit, search, departmentId);
    }
    getMyProfile(req) {
        return this.employeesService.getMyProfile(req.user.sub);
    }
    updateMyProfile(req, dto) {
        return this.employeesService.updateMyProfile(req.user.sub, dto);
    }
    findOne(id) {
        return this.employeesService.findOne(id);
    }
    update(id, dto) {
        return this.employeesService.update(id, dto);
    }
    remove(id) {
        return this.employeesService.remove(id);
    }
};
__decorate([
    Post(),
    Roles('ADMIN', 'HR_MANAGER'),
    UseInterceptors(FileInterceptor('profileImage', {
        storage: diskStorage({
            destination: './uploads/profiles',
            filename: (_req, file, callback) => {
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
                    extname(file.originalname);
                callback(null, uniqueName);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, callback) => {
            if (!file.mimetype.startsWith('image/')) {
                callback(new BadRequestException('Only image files are allowed'), false);
                return;
            }
            callback(null, true);
        },
    })),
    __param(0, Body()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    Get(),
    Roles('ADMIN', 'HR_MANAGER'),
    __param(0, Query('page', new DefaultValuePipe(1), ParseIntPipe)),
    __param(1, Query('limit', new DefaultValuePipe(10), ParseIntPipe)),
    __param(2, Query('search')),
    __param(3, Query('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findAll", null);
__decorate([
    Get('me'),
    Roles('EMPLOYEE'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getMyProfile", null);
__decorate([
    Patch('me'),
    Roles('EMPLOYEE'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateMyProfileDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "updateMyProfile", null);
__decorate([
    Get(':id'),
    Roles('ADMIN', 'HR_MANAGER'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles('ADMIN', 'HR_MANAGER'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateEmployeeDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "remove", null);
EmployeesController = __decorate([
    Controller('employees'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [EmployeesService])
], EmployeesController);
export { EmployeesController };
//# sourceMappingURL=employees.controller.js.map