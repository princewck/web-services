import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { catchError, first, firstValueFrom, interval, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { ALI_TEXT_GEN_API, OPENAI_LIST_MODELS } from './constants';
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
      "model": "qwen-turbo",
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

  async askOneJSON(question, schema) {
    const questionStr = question + ',使用 json 格式返回, 返回内容仅包含原生 json 字符串, 不要用 markdown 表示, 结果不包含符号, schema 是' + JSON.stringify(schema);
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
}
