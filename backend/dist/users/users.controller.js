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
import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateHrManagerDto } from './dto/create-hr-manager.dto.js';
import { UpdateHrManagerDto } from './dto/update-hr-manager.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    createHrManager(dto) {
        return this.usersService.createHrManager(dto);
    }
    findAllHrManagers() {
        return this.usersService.findAllHrManagers();
    }
    updateHrManager(id, dto) {
        return this.usersService.updateHrManager(id, dto);
    }
    removeHrManager(id) {
        return this.usersService.removeHrManager(id);
    }
};
__decorate([
    Post('hr-managers'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateHrManagerDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createHrManager", null);
__decorate([
    Get('hr-managers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAllHrManagers", null);
__decorate([
    Patch('hr-managers/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateHrManagerDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateHrManager", null);
__decorate([
    Delete('hr-managers/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "removeHrManager", null);
UsersController = __decorate([
    Controller('users'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map