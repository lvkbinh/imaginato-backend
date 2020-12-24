import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthCheckService {
  constructor(private configService: ConfigService) {}
}