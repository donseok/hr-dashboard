import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DevelopmentService } from './development.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class DevelopmentResolver {
  constructor(private readonly developmentService: DevelopmentService) {}

  @Query('trainingPrograms')
  async getTrainingPrograms(@Args('category') category?: string) {
    return this.developmentService.getPrograms(category);
  }

  @Query('trainingProgram')
  async getTrainingProgram(@Args('id') id: string) {
    return this.developmentService.getProgramById(id);
  }

  @Query('myEnrollments')
  async getMyEnrollments(@CurrentUser() user: CurrentUserData) {
    if (!user.employeeId) return [];
    return this.developmentService.getMyEnrollments(user.employeeId);
  }

  @Query('developmentDashboard')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getDevelopmentDashboard() {
    return this.developmentService.getDashboard();
  }

  @Query('skillGapAnalysis')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getSkillGapAnalysis() {
    return this.developmentService.getSkillGapAnalysis();
  }

  @Query('internalMobilityRate')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getInternalMobilityRate() {
    return this.developmentService.getInternalMobilityRate();
  }

  @Mutation('createProgram')
  @Roles('HR_SPECIALIST', 'ADMIN')
  async createProgram(
    @Args('input') input: any,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.developmentService.createProgram(input, user.userId);
  }

  @Mutation('enrollEmployee')
  @Roles('HR_SPECIALIST', 'ADMIN', 'MANAGER')
  async enrollEmployee(
    @Args('input') input: any,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.developmentService.enrollEmployee(input, user.userId);
  }

  @Mutation('completeTraining')
  @Roles('HR_SPECIALIST', 'ADMIN')
  async completeTraining(
    @Args('enrollmentId') enrollmentId: string,
    @Args('score') score: number | undefined,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.developmentService.completeTraining(enrollmentId, score, user.userId);
  }
}
