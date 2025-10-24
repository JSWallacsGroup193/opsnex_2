import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerPerformanceDto } from './create-customer-performance.dto';

export class UpdateCustomerPerformanceDto extends PartialType(CreateCustomerPerformanceDto) {}
