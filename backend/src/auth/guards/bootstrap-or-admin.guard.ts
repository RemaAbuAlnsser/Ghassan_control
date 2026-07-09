import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AdminAuthGuard } from './admin-auth.guard';

@Injectable()
export class BootstrapOrAdminGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminAuthGuard: AdminAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const hasUsers = await this.usersService.hasAnyUser();
    if (!hasUsers) return true;

    return this.adminAuthGuard.canActivate(context) as Promise<boolean>;
  }
}
