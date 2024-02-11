import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUpDto';
import { UserRoles } from 'src/schemas/user.schema';
import { Roles } from './decorators/roles.decorator';

@Controller('auth/admin')
export class AuthAdminController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Roles(UserRoles.ADMIN)
  create(@Body() createAdminDto: SignUpDto) {
    const data = { ...createAdminDto, role: UserRoles.ADMIN };
    return this.authService.signUp(data);
  }
}
