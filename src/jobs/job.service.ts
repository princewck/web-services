import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);
  private isMaster: boolean;

  constructor(
    private readonly taskService: TasksService,
    private readonly configService: ConfigService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.isMaster = configService.get('MASTER_NODE');
    console.log('this.isMaster', this.isMaster, typeof this.isMaster);
  }

  @Interval(100)
  async handleTaskStartup() {
    if (!this.isMaster) {
      return;
    }
    await this.taskService.checkStartup();
  }



  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the second is 45');
  // }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}