import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CultureService } from './culture.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class CultureResolver {
  constructor(private readonly cultureService: CultureService) {}

  @Query('surveys')
  async getSurveys(@Args('type') type?: string) {
    return this.cultureService.getSurveys(type);
  }

  @Query('survey')
  async getSurvey(@Args('id') id: string) {
    return this.cultureService.getSurveyById(id);
  }

  @Query('cultureDashboard')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getCultureDashboard() {
    return this.cultureService.getDashboard();
  }

  @Query('engagementTrend')
  async getEngagementTrend(@Args('months') months?: number) {
    return this.cultureService.getEngagementTrend(months);
  }

  @Query('eNPSScore')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getENPSScore() {
    return this.cultureService.getENPSScore();
  }

  @Query('sentimentAnalysis')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getSentimentAnalysis(@Args('surveyId') surveyId?: string) {
    return this.cultureService.getSentimentAnalysis(surveyId);
  }

  @Mutation('createSurvey')
  @Roles('HR_SPECIALIST', 'ADMIN')
  async createSurvey(
    @Args('input') input: any,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.cultureService.createSurvey(input, user.userId);
  }

  @Mutation('submitSurveyResponse')
  async submitSurveyResponse(
    @Args('input') input: any,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.cultureService.submitResponse(input, user.employeeId);
  }
}
