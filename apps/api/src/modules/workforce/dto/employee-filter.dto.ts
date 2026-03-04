import { IsOptional, IsArray, IsString } from 'class-validator';

export class EmployeeFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departmentIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  statuses?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employmentTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @IsString()
  search?: string;
}
