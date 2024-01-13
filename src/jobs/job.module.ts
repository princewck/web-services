import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule],
  providers: [JobService],
})
export class JobModule {}