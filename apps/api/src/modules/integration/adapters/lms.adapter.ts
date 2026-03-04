import { Injectable, Logger } from '@nestjs/common';

export interface LmsCourse {
  externalId: string;
  title: string;
  category: string;
  provider: string;
  duration: number;
}

export interface LmsAdapter {
  name: string;
  fetchCourses(): Promise<LmsCourse[]>;
  syncEnrollment(enrollmentId: string, status: string): Promise<void>;
}

@Injectable()
export class DefaultLmsAdapter implements LmsAdapter {
  private readonly logger = new Logger(DefaultLmsAdapter.name);

  name = 'default-lms';

  async fetchCourses(): Promise<LmsCourse[]> {
    this.logger.debug('LMS adapter: fetchCourses (placeholder)');
    return [];
  }

  async syncEnrollment(_enrollmentId: string, _status: string): Promise<void> {
    this.logger.debug('LMS adapter: syncEnrollment (placeholder)');
  }
}
