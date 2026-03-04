import { Controller, Post, Body, UnauthorizedException, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterUserDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        if (!Object.values(require('../common/enums/area.enum').WorkArea).includes(loginDto.area)) {
            throw new BadRequestException('El área especificada no es válida');
        }
        
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verificar que el área del usuario coincida
        if (user.area !== loginDto.area) {
            throw new UnauthorizedException('El área especificada no coincide con la del usuario');
        }

        return this.authService.login(user);
    }

    @Post('register')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.registerUser(registerUserDto);
    }
}

