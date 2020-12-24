import {
  Controller,
  Get,
  Header,
  HttpCode,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';

@Controller('health-check')
@ApiTags('Health Check')
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  @ApiOkResponse({ description: 'Connect to backend server successfully' })
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  heartBeat(): boolean {
    return true;
  }
}