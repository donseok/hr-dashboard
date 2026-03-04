import { Injectable, Logger } from '@nestjs/common';
import { DefaultAtsAdapter } from '../adapters/ats.adapter';
import { DefaultHrisAdapter } from '../adapters/hris.adapter';
import { DefaultLmsAdapter } from '../adapters/lms.adapter';

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);

  constructor(
    private readonly atsAdapter: DefaultAtsAdapter,
    private readonly hrisAdapter: DefaultHrisAdapter,
    private readonly lmsAdapter: DefaultLmsAdapter,
  ) {}

  async syncAll(): Promise<void> {
    this.logger.log('Starting full data sync...');
    await this.syncEmployees();
    await this.syncCourses();
    this.logger.log('Full data sync completed');
  }

  async syncEmployees(): Promise<void> {
    this.logger.log(`Syncing employees from ${this.hrisAdapter.name}...`);
    const employees = await this.hrisAdapter.fetchEmployees();
    this.logger.log(`Fetched ${employees.length} employees`);
  }

  async syncCourses(): Promise<void> {
    this.logger.log(`Syncing courses from ${this.lmsAdapter.name}...`);
    const courses = await this.lmsAdapter.fetchCourses();
    this.logger.log(`Fetched ${courses.length} courses`);
  }
}
