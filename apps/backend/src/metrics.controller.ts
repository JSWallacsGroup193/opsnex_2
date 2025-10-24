import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('monitoring')
@Controller('metrics')
export class MetricsController {
  @Get()
  @ApiOkResponse({ schema: { example: { uptime: 12345, timestamp: '2025-10-18T00:00:00Z' } } })
  async metrics() {
    return {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
    };
  }
}
