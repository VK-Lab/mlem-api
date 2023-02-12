import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/common';

/**
 * https://docs.nestjs.com/recipes/terminus
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const result = await this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.http.pingCheck('dns', 'https://1.1.1.1'),
      // async (): Promise<HealthIndicatorResult> => this.db.pingCheck('database'),
    ]);

    return  result;
  }
}
