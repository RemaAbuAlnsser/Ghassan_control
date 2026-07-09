import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { BootstrapOrAdminGuard } from '../auth/guards/bootstrap-or-admin.guard';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';
import type { AdminJwtPayload } from '../auth/interfaces/admin-jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(BootstrapOrAdminGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAdmin() admin: AdminJwtPayload,
  ) {
    if (admin.sub === id) {
      throw new ForbiddenException('لا يمكنك حذف حسابك الخاص أثناء تسجيل دخولك به');
    }
    return this.usersService.remove(id);
  }
}
