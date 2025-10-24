import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerEquipmentDto } from './create-customer-equipment.dto';

export class UpdateCustomerEquipmentDto extends PartialType(CreateCustomerEquipmentDto) {}
