import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { BootstrapOrAdminGuard } from '../auth/guards/bootstrap-or-admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AdminAuthGuard, BootstrapOrAdminGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
