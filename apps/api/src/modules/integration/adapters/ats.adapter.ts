import { Injectable, Logger } from '@nestjs/common';

export interface AtsCandidate {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  source: string;
  resumeUrl?: string;
}

export interface AtsAdapter {
  name: string;
  fetchCandidates(requisitionId: string): Promise<AtsCandidate[]>;
  syncApplication(applicationId: string, status: string): Promise<void>;
}

@Injectable()
export class DefaultAtsAdapter implements AtsAdapter {
  private readonly logger = new Logger(DefaultAtsAdapter.name);

  name = 'default-ats';

  async fetchCandidates(_requisitionId: string): Promise<AtsCandidate[]> {
    this.logger.debug('ATS adapter: fetchCandidates (placeholder)');
    return [];
  }

  async syncApplication(_applicationId: string, _status: string): Promise<void> {
    this.logger.debug('ATS adapter: syncApplication (placeholder)');
  }
}
