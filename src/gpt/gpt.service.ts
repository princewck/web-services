import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { catchError, firstValueFrom, interval, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { OPENAI_LIST_MODELS } from './constants';

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
}
