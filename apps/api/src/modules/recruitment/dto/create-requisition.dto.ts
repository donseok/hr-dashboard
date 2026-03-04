import { IsString, IsOptional, IsInt, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateRequisitionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  departmentId: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSalary?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  headcount?: number;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;
}
