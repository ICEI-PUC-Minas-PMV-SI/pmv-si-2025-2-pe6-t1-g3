import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
@ApiTags('Health')
export class HealthController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'store-backend',
      version: '2.0.0'
    };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'API is running' })
  root() {
    return {
      message: 'Store E-commerce API is running',
      version: '2.0.0',
      documentation: '/api',
      timestamp: new Date().toISOString()
    };
  }
}