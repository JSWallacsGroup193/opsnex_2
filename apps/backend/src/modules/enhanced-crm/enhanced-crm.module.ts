import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { CustomerPerformanceModule } from './customer-performance/customer-performance.module';
import { CustomerEquipmentModule } from './customer-equipment/customer-equipment.module';

@Module({
  imports: [PropertyModule, CustomerPerformanceModule, CustomerEquipmentModule],
  exports: [PropertyModule, CustomerPerformanceModule, CustomerEquipmentModule],
})
export class EnhancedCrmModule {}
