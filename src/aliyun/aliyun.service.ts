import { BadRequestException, HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import { ConfigService } from '@nestjs/config';
import { isDev, sleep } from '../utils';
import { SEND_SMD_FAILED } from './constants';
import * as OSS from 'ali-oss';
import { STS } from 'ali-oss';
import * as statementFull from './statement.full.json';
import * as statementReadonly from './statement.readonly.json';
import * as statementReadonlyWithList from './statement.readonly_enable_list.json';
import getStatementPut from './statement.put';
import imageseg20191230, * as $imageseg20191230 from '@alicloud/imageseg20191230';
import * as ViapiClient from '@alicloud/viapi20230117';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Tasks } from '../models';
import { TasksService } from '../tasks/tasks.service';
import { TaskStatus } from '../models/entities/Tasks';

export enum STS_POLICY_TYPE {
  FULL = 'full',
  READONLY = 'readonly',
  READONLY_WITH_LIST = 'readonly_with_list',
  PUT = 'put'
}

/**
 * https://ram.console.aliyun.com/roles/minnuo-user
 * 注意申请角色的时候要申请用户角色, 而不是服务角色 https://blog.csdn.net/u014089832/article/details/118735933
 * */
const mintrole = 'acs:ram::1646881312224974:role/minnuo-user';

const getPolicy = (type: STS_POLICY_TYPE) => {
  return {
    [STS_POLICY_TYPE.FULL]: statementFull,
    [STS_POLICY_TYPE.READONLY]: statementReadonly,
    [STS_POLICY_TYPE.READONLY_WITH_LIST]: statementReadonlyWithList,
  }[type];
}

function getStatement(type: STS_POLICY_TYPE, filename?: string) {
  if (type === STS_POLICY_TYPE.PUT) {
    return getStatementPut(filename ?? 'default');
  }
  return getPolicy(type);
}




@Injectable()
export class AliyunService {

  private readonly logger = new Logger(AliyunService.name);

  private accessKeyId: string;
  private accessKeySecret: string;

  constructor(
    private readonly configService: ConfigService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly taskService: TasksService,
  ) {
    this.accessKeyId = this.configService.get('ALI_ACCESS_KEY_ID');
    this.accessKeySecret = this.configService.get('ALI_ACCESS_KEY_SECRET');
  }

  /** 短信服务 */
  private createSMSClient(): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
    });
    return new Dysmsapi20170525(config);
  }

  async sendSMS(phoneNumber: string, code: string) {
    if (!code) throw new BadRequestException('code 不能为空');
    const client = this.createSMSClient();
    const options = new $Dysmsapi20170525.SendSmsRequest({
      signName: '上海闵诺网络科技',
      templateCode: 'SMS_287610622',
      phoneNumbers: phoneNumber,
      templateParam: JSON.stringify({ code })
    });
    const runtime = new $Util.RuntimeOptions({});
    try {
      const { body: res } = await client.sendSmsWithOptions(options, runtime);
      if (res?.code?.toLocaleLowerCase() !== 'ok') {
        this.logger.error(res);
        throw new HttpException(isDev ? res.message : SEND_SMD_FAILED, 400);
      }
    } catch (e) {
      throw new HttpException(isDev ? e.message : SEND_SMD_FAILED, 400);
    }
  }


  /** OSS */
  /** https://oss.console.aliyun.com/sdk */
  async putOSSObject(filename: string, file: any, options?: OSS.PutObjectOptions) {
    const store = await this.getSTSClient(STS_POLICY_TYPE.PUT, filename);
    try {
      const key = 'mintools/' + filename;
      const { name, url } = await store.put(key, file, options);
      return {
        key: name,
        url,
        status: 'SUCCESS',
      };
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  async listOSSObject() {
    const store = await this.getSTSClient(STS_POLICY_TYPE.FULL);
    try {
      const result = await store.list({ prefix: 'mintools', "max-keys": '100' }, {});
      return {
        objects: result.objects,
        nextMarker: result.nextMarker,
      };
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
  async listOSSImages() {
    const store = await this.getSTSClient(STS_POLICY_TYPE.FULL);
    try {
      const result = await store.list({ prefix: 'mintools/img', "max-keys": '100' }, {});
      return {
        objects: result.objects,
        nextMarker: result.nextMarker,
      };
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  /** STS */
  async createReadonlySTS() {
    const policy = getPolicy(STS_POLICY_TYPE.READONLY);
    return await this.createSTS(policy);
  }

  /** 上报 file, 用 policy 限制可上传的文件名  */
  async createPutSTS(file: string) {
    if (!file) {
      throw new Error('文件名不能为空');
    }
    if (!file.startsWith('mintools/')) {
      throw new Error('文件名不符合规范');
    }
    const statement = getStatement(STS_POLICY_TYPE.PUT, file);
    console.log('statement', JSON.stringify(statement));
    return await this.createSTS(statement);
  }


  /** 视觉智能, 人体抠图 */
  async segmentBody(imageURL: string, hd = false, user?: any): Promise<{ imageURL: string }> {
    const client = this.createClient();
    let segmentBodyRequest = hd ? new $imageseg20191230.SegmentHDBodyRequest({ imageURL })
      : new $imageseg20191230.SegmentBodyRequest({
        imageURL,
      });
    let runtime = new $Util.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      let res;
      if (!hd) {
        res = await client.segmentBodyWithOptions(segmentBodyRequest, runtime);
      } else {
        res = await client.segmentHDBodyWithOptions(segmentBodyRequest, runtime);
      }
      return res?.body?.data;
    } catch (error) {
      // 如有需要，请打印 error
      Util.assertAsString(error.message);
      console.error(error);
      if (!hd && error.data.Code === 'InvalidFile.Resolution') {
        console.log('使用高清抠图');
        // FIXME 高清抠图为收费功能
        return await this.segmentBody(imageURL, true);
      }
    }
  }

  /** 视觉智能, 通用抠图 */
  async segmentCommon(imageUrl: string, hd = false, user?: any): Promise<{ imageURL?: string; requestId?: string }> {
    const client = this.createClient();
    let segmentBodyRequest = hd ? new $imageseg20191230.SegmentHDCommonImageRequest({ imageUrl })
      : new $imageseg20191230.SegmentCommonImageRequest({
        imageURL: imageUrl,
      });
    let runtime = new $Util.RuntimeOptions({});
    const segCommonTaskName = `segment:common:${hd}`;
    const task = new Tasks();
    task.createdAt = Date.now();
    task.deletedAt = Date.now() + 1000 * 30;// 30秒后丢弃任务
    task.nodeName = this.configService.get('NODE_NAME');
    task.taskName = segCommonTaskName;
    task.status = TaskStatus.INITIAL;
    task.desc = `${user?.mobile??'default'}::${imageUrl}`;
    const segmentTask = await this.taskService.create(task);

    const getTaskStatus = async (): Promise<TaskStatus> => {
      const task = await this.taskService.findOne(segmentTask.id);
      return task.status;
    }
    const currentTooBusy = async (): Promise<boolean> => {
      console.time('testpending');
      const result = await this.taskService.pendingStatus(segCommonTaskName, hd ? 2 : 5);
      console.timeEnd('testpending');
      return result;
    }
    console.time('testbusy');
    const busy = await currentTooBusy();
    console.timeEnd('testbusy');
    // 5s 都处理不完, 拒绝客户端, 客户端稍后重试
    if (busy) {
      throw new HttpException('service is too busy!!', 400);
    }
    let status = await getTaskStatus();
    let retryCount = 0;

    // 最大请求挂起时间 20s
    while (status !== TaskStatus.PROCESSING) {
      if (retryCount >= 150) {
        throw new HttpException('service is too busy now', 400);
      }
      await sleep(200); // 一秒后重试
      retryCount += 1;
      status = await getTaskStatus();
    }
    const finishTask = async () => {
      console.time('finishTask');
      await this.taskService.finishTask(segmentTask.id);
      console.timeEnd('finishTask');
    }
    try {
      // 复制代码运行请自行打印 API 的返回值
      let res;
      if (!hd) {
        // TODO: 并发度需要根据部署情况和返回速度进行调整
        console.time('segmentcommon');
        res = await client.segmentCommonImageWithOptions(segmentBodyRequest, runtime);
        console.timeEnd('segmentcommon');
      } else {
        // 检查可用余额, 并扣费, 否则提示充值
        res = await client.segmentHDCommonImageWithOptions(segmentBodyRequest, runtime);
      }
      // await updateConcurrentCount();
      // await this.cacheManager.set(globalConcurrentRedisKey, Math.max(concurrentCount - 1, 0), cacheOptions);
      if (hd) {
        await finishTask();
        return res?.body;
      }
      await finishTask();
      return res?.body?.data;
    } catch (error) {
      // 如有需要，请打印 error
      Util.assertAsString(error.message);
      console.error(error);
      // await updateConcurrentCount();
      // await this.cacheManager.set(globalConcurrentRedisKey, Math.max(concurrentCount - 1, 0), cacheOptions);
      if (!hd && error?.data?.Code === 'InvalidFile.Resolution') {
        console.log('使用高清抠图', imageUrl);
        // FIXME 高清抠图为收费功能
        // throw new HttpException('图片分辨率较高, 暂不支持', 422);
        await finishTask();
        return await this.segmentCommon(imageUrl, true, user);
      } else {
        await finishTask();
        throw new HttpException('操作失败', 400);
      }
    }
  }

  async getAsyncJobResult(requestId: string) {
    // const client = this.createClient();
    let config = new $OpenApi.Config({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imageseg
    // config.endpoint = `imageseg.cn-shanghai.aliyuncs.com`;
    // const client = new $OpenApi.default(config);
    const client = this.createClient();
    // const client = new ViapiClient.default(config);
    const getAsyncJobResultRequest = new $imageseg20191230.GetAsyncJobResultRequest({
      jobId: requestId,
    });
    return client.getAsyncJobResult(getAsyncJobResultRequest);
  }

  private ossCache: Map<string, {
    instance?: OSS;
    expires: number;
  }> = new Map();

  private async getSTSClient(type: STS_POLICY_TYPE, key?: string) {
    const cache = this.ossCache.get(key ?? 'default');
    if (cache?.instance && Date.now() < cache?.expires) {
      return cache.instance;
    }
    const statement = getStatement(type, key);
    const sts = await this.createSTS(statement);
    const oss = new OSS({
      region: this.configService.get('OSS_REGION'),
      bucket: this.configService.get('OSS_BUCKET'),
      // endpoint: this.configService.get('OSS_ENTRYPOINT'),
      accessKeyId: sts.accessKeyId,
      accessKeySecret: sts.accessKeySecret,
      stsToken: sts.stsToken,
    });
    this.ossCache.set(key ?? 'default', {
      instance: oss,
      expires: Date.now() + this.configService.get('OSS_EXPIRE_MINUTES') * 60 * 1000,
    })
    return oss;
  }

  private async createSTS(policy: string) {
    const sts = new STS({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
    });
    try {
      /** 不能使用主账号调用, 注意使用子账号的 ak, sk, 并且为子账号授权 AliyunSTSAssumeRoleAccess */
      const res = await sts.assumeRole(mintrole, JSON.stringify(policy), 60 * this.configService.get('OSS_EXPIRE_MINUTES') ?? 15);
      return {
        accessKeyId: res.credentials.AccessKeyId,
        accessKeySecret: res.credentials.AccessKeySecret,
        stsToken: res.credentials.SecurityToken,
        expiration: res.credentials.Expiration,
        region: this.configService.get('OSS_REGION'),
        bucket: this.configService.get('OSS_BUCKET'),
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.AccessDeniedDetail || e.message, 400);
    }
  }

  private createClient(): imageseg20191230 {
    let config = new $OpenApi.Config({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imageseg
    config.endpoint = `imageseg.cn-shanghai.aliyuncs.com`;
    return new imageseg20191230(config);
  }

  private createOldClient() {
    let config = new $OpenApi.Config({
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imageseg
    config.endpoint = `viapi.cn-shanghai.aliyuncs.com`;
    return new ViapiClient.default(config);
  }

}
