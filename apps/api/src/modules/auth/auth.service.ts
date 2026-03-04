import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../shared/database/prisma.service';
import { comparePassword } from '../../shared/utils/crypto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.userAccount.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: { include: { role: true } },
        employee: { select: { id: true, departmentId: true } },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.userAccount.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = user.userRoles.flatMap((ur) => {
      const perms = ur.role.permissions;
      return Array.isArray(perms) ? perms : [];
    });

    const payload: JwtPayload = { sub: user.id, email: user.email, roles };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    this.logger.log(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        roles: user.userRoles.map((ur) => ({ id: ur.role.id, name: ur.role.name, permissions: ur.role.permissions })),
        permissions,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.prisma.userAccount.findUnique({
        where: { id: payload.sub },
        include: { userRoles: { include: { role: true } } },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const roles = user.userRoles.map((ur) => ur.role.name);
      const newPayload: JwtPayload = { sub: user.id, email: user.email, roles };

      return {
        accessToken: this.jwtService.sign(newPayload, {
          expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
        }),
        refreshToken: this.jwtService.sign(newPayload, {
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        }),
        expiresIn: 900,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.userAccount.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
      email: user.email,
      employeeId: user.employeeId,
      roles: user.userRoles.map((ur) => ({ id: ur.role.id, name: ur.role.name, permissions: ur.role.permissions })),
      permissions: user.userRoles.flatMap((ur) => {
        const perms = ur.role.permissions;
        return Array.isArray(perms) ? perms : [];
      }),
    };
  }
}
