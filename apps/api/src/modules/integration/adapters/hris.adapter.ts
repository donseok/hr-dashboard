import { Injectable, Logger } from '@nestjs/common';

export interface HrisEmployee {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  status: string;
}

export interface HrisAdapter {
  name: string;
  fetchEmployees(): Promise<HrisEmployee[]>;
  syncEmployee(employeeId: string): Promise<void>;
}

@Injectable()
export class DefaultHrisAdapter implements HrisAdapter {
  private readonly logger = new Logger(DefaultHrisAdapter.name);

  name = 'default-hris';

  async fetchEmployees(): Promise<HrisEmployee[]> {
    this.logger.debug('HRIS adapter: fetchEmployees (placeholder)');
    return [];
  }

  async syncEmployee(_employeeId: string): Promise<void> {
    this.logger.debug('HRIS adapter: syncEmployee (placeholder)');
  }
}
