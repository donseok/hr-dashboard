import { Injectable, Logger } from '@nestjs/common';

export interface ExternalSurveyResponse {
  externalId: string;
  surveyId: string;
  respondentEmail: string;
  responses: Record<string, unknown>;
  submittedAt: string;
}

export interface SurveyAdapter {
  name: string;
  fetchResponses(surveyId: string): Promise<ExternalSurveyResponse[]>;
}

@Injectable()
export class DefaultSurveyAdapter implements SurveyAdapter {
  private readonly logger = new Logger(DefaultSurveyAdapter.name);

  name = 'default-survey';

  async fetchResponses(_surveyId: string): Promise<ExternalSurveyResponse[]> {
    this.logger.debug('Survey adapter: fetchResponses (placeholder)');
    return [];
  }
}
