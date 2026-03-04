import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../shared/database/prisma.service';
import { JwtPayload } from '../entities/jwt-payload.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.userAccount.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: { include: { role: true } },
        employee: { select: { id: true, departmentId: true } },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    return {
      id: user.id,
      email: user.email,
      employeeId: user.employeeId,
      departmentId: user.employee?.departmentId,
      roles: user.userRoles.map((ur) => ur.role.name),
      permissions: user.userRoles.flatMap((ur) => {
        const perms = ur.role.permissions;
        return Array.isArray(perms) ? perms : [];
      }),
    };
  }
}
