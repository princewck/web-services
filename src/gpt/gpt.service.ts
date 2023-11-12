import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { catchError, first, firstValueFrom, interval, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { ALI_TEXT_GEN_API, BAIDU_TEXT_GEN_API, BAIDU_TEXT_GEN_PRO_API, OPENAI_LIST_MODELS } from './constants';
import { AxiosError } from 'axios';

@Injectable()
export class GptService {

  private readonly logger = new Logger(GptService.name);
  private history: any[] = [];
  private openai: OpenAIApi;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    this.openai = new OpenAIApi(configuration);
  }

  prompt(params: any): Observable<MessageEvent> {
    const { model = 'gpt-3.5-turbo', messages } = params;
    // const messages = this.history.concat([{ role: "user", content }]);
    const $end = new Subject();
    return new Observable<MessageEvent>((subscriber) => {
      const res = this.openai.createChatCompletion({
        model,
        messages,
        stream: true,
      }, { timeout: 30000, responseType: 'stream' }).then((chatCompletion: any) => {
        const stream = chatCompletion.data;
        stream.on('error', error => {
          console.error(error);
        });
        stream.on('data', (data) => {
          const lines = data.toString().split('\n').filter(line => line.trim() !== '');
          console.log('lines', lines);
          for (const line of lines) {
            const message = line.replace(/^data: /, '');
            console.log('message', message);
            if (message === '[DONE]') {
              $end.next('end');
              return;
            }
            try {
              subscriber.next({ data: message });
            } catch (error) {
              console.error('Could not JSON parse stream message', message, error);
            }
          }
        });
      }, (e) => {
        console.error(e);
      });
    }).pipe(takeUntil($end));
  }

  async prompt2(params: any) {
    const { model = 'gpt-3.5-turbo', content } = params;
    const completion = await this.openai.createChatCompletion({
      model,
      messages: this.history.concat([{ role: "user", content }]),
    }, { timeout: 60000 });
    return completion.data.choices[0].message;
  }

  async models() {
    const apiKey = this.configService.get('OPENAI_API_KEY');
    const res = await firstValueFrom(this.httpService.get(OPENAI_LIST_MODELS, { headers: { Authorization: `Bearer ${apiKey}`, 'Accept-Encoding': '*' } }).pipe(catchError(error => {
      console.error(error);
      throw new HttpException({
        code: 'FAIL',
        message: '失败',
      }, 403);
    })));
    return res.data?.data || [];
  }



  async askOne(question: string) {
    const res = await firstValueFrom(this.httpService.post<any>(ALI_TEXT_GEN_API, {
      "model": "qwen-max",
      "input": {
        "prompt": question,
      }
    }, {
      headers: {
        Authorization: this.configService.get('ALI_TEXT_GEN_API_KEY'),
      },
    }).pipe(
      catchError((error: AxiosError) => {
        throw error.response.data;
      }),
      first(),
    ));
    return res.data;
  }


  async askMessagesALI(messages: { role: string; content: string }[]) {
    const res = await firstValueFrom(this.httpService.post<any>(ALI_TEXT_GEN_API, {
      "model": "qwen-max",
      "input": {
        messages,
        seed: 'mintools',
        temperature: 0.1
      }
    }, {
      headers: {
        Authorization: this.configService.get('ALI_TEXT_GEN_API_KEY'),
      },
    }).pipe(
      catchError((error: AxiosError) => {
        throw error.response.data;
      }),
      first(),
    ));
    return res.data;
  }
  //百度
  //https://console.bce.baidu.com/tools/?_=1699797018399&u=bce-head#/api?product=AI&project=%E5%8D%83%E5%B8%86%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%B3%E5%8F%B0&parent=ERNIE-Bot-4&api=rpc%2F2.0%2Fai_custom%2Fv1%2Fwenxinworkshop%2Fchat%2Fcompletions_pro&method=post
  async askMessagesBD(messages: { role: string; content: string }[], pro?: boolean, system?: string) {
    const token = await this.getBaiDuAccessToken();
    console.log('token', token);
    const api = (pro ? BAIDU_TEXT_GEN_PRO_API : BAIDU_TEXT_GEN_API) + `?access_token=${token}`;
    const options: any = {
      messages,
      temperature: 0.01,
    };
    if (system) {
      options.system = system;
    }
    const res = await firstValueFrom(this.httpService.post<any>(api, options, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).pipe(
      catchError((error: AxiosError) => {
        throw error.response.data;
      }),
      first(),
    ));
    return res.data;
  }

  async askMessagesJSONALI(messages: { role: string; content: string }[]) {
    const data = await this.askMessagesALI(messages);
    try {
      if (data.output?.text) {
        console.log('text', data.output?.text);
        return JSON.parse(data.output?.text);
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async askOneJSON(question, schema, demo?) {
    let questionStr = question + '回答内容仅包含原生 json 字符, 请不要包含额外字符, 不要用 markdown 格式';
    if (schema) {
      questionStr += 'json schema 是' + JSON.stringify(schema);
    }
    if (demo) {
      questionStr += ',' + demo;
    }
    console.log('questionStr', questionStr);
    const data = await this.askOne(questionStr);
    try {
      if (data.output?.text) {
        console.log('text', data.output?.text);
        return JSON.parse(data.output?.text);
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private async getBaiDuAccessToken() {
    const ak = this.configService.get('BAIDU_LLM_CLIENT_ID');
    const sk = this.configService.get('BAIDU_LLM_CLIENT_SECRET');
    const url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + ak + '&client_secret=' + sk;
    const res = await firstValueFrom(this.httpService.post<any>(url).pipe(
      catchError((error: AxiosError) => {
        throw error.response.data;
      }),
      first(),
    ));
    return res.data.access_token;
  }
}
