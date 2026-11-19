import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service.js';
import { CreateHrManagerDto } from './dto/create-hr-manager.dto.js';
import { UpdateHrManagerDto } from './dto/update-hr-manager.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('hr-managers')
  createHrManager(@Body() dto: CreateHrManagerDto) {
    return this.usersService.createHrManager(dto);
  }

  @Get('hr-managers')
  findAllHrManagers() {
    return this.usersService.findAllHrManagers();
  }

  @Patch('hr-managers/:id')
  updateHrManager(
    @Param('id') id: string,
    @Body() dto: UpdateHrManagerDto,
  ) {
    return this.usersService.updateHrManager(id, dto);
  }

  @Delete('hr-managers/:id')
  removeHrManager(@Param('id') id: string) {
    return this.usersService.removeHrManager(id);
  }
}