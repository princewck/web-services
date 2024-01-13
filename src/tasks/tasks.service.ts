import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from '../models';
import { Repository, Between, In, MoreThan } from 'typeorm';
import { TaskStatus } from '../models/entities/Tasks';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Tasks) private readonly taskRepository: Repository<Tasks>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    await this.taskRepository.save(task);
    return task;
  }

  // 根据并发限制检查是否有可以启动的任务
  async checkStartup() {
    const concurrencyConfigs: [string, number][] = [
      ['segment:common:true', 2],
      ['segment:common:false', 5],
    ];
    await Promise.allSettled(concurrencyConfigs.map(async ([taskName, concurrencyLimit]) => {
      const processingRedisKey = `task_processing:${taskName}`;
      const processing = await this.cacheManager.get(processingRedisKey);
      if (processing === 'true') {
        console.log('already processing, skip');
        return;
      }
      await this.cacheManager.set(processingRedisKey, 'true', { ttl: 30 });
      const now = Date.now();
      const pastOneSec = Date.now() - 1500;
      const pastMin = Date.now() - 1000 * 60;
      try {
        // 1s 内进行中和完成的请求
        const finishedTasksInLastSec = await this.taskRepository.find({
          where: {
            taskName,
            finishedAt: Between(pastOneSec, now),
            status: TaskStatus.FINISHED,
          }
        });
        const processingTasks = await this.taskRepository.find({
          where: {
            taskName,
            createdAt: Between(pastMin, now),
            status: TaskStatus.PROCESSING,
            deletedAt: MoreThan(Date.now()),
          }
        });
        const qpsCount = (processingTasks?.length ?? 0) + (finishedTasksInLastSec?.length ?? 0);
        const availableCount = concurrencyLimit - qpsCount;
        if (availableCount > 0) {
          const popNewItems = await this.taskRepository.find({
            where: {
              taskName,
              createdAt: MoreThan(pastMin),
              status: TaskStatus.INITIAL,
            },
            take: availableCount,
            order: {
              createdAt: 'ASC'
            },
          });
          if (popNewItems.length > 0) {
            await this.taskRepository.update({ id: In(popNewItems?.map(i => i.id)) }, { status: TaskStatus.PROCESSING });
          }
        }
      } catch (e) {
        console.error('调度任务失败, 错误如下:');
        console.error(e);
      }
      await this.cacheManager.set(processingRedisKey, 'false', { ttl: 1 });
    }));
  }

  async finishTask(id: number) {
    await this.taskRepository.update({ id }, { status: TaskStatus.FINISHED, finishedAt: Date.now() });
  }

  // 是否过于繁忙, 处理不完积压的请求就直接拒绝
  async pendingStatus(taskName, limit: number = 2) {
    const now = Date.now();
    const pastMin = Date.now() - 60 * 1000 * 60;
  
    const count = await this.taskRepository.count({
      where: {
        taskName,
        createdAt: Between(pastMin, now),
        status: TaskStatus.INITIAL,
        deletedAt: MoreThan(Date.now())
      }
    });
    return count > limit * 10;
  }

  findAll() {
    return `This action returns all tasks`;
  }

  async findOne(id: number) {
    return await this.taskRepository.findOne({ where: { id } });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
