import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, area: user.area };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                area: user.area
            }
        };
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        // Verificar si el usuario ya existe
        const existingUser = await this.usersService.findByEmail(registerUserDto.email);
        if (existingUser) {
            throw new BadRequestException('El correo electrónico ya está registrado');
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(registerUserDto.password, salt);

        // Crear usuario
        const newUser = await this.usersService.create({
            email: registerUserDto.email,
            passwordHash,
            role: registerUserDto.role,
            area: registerUserDto.area,
        });

        const { passwordHash: _, ...result } = newUser;
        return {
            message: 'Usuario registrado exitosamente',
            user: result,
        };
    }
}
