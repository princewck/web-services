import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { catchError, firstValueFrom } from 'rxjs';
import { OPENAI_LIST_MODELS } from './constants';
import { get } from 'socks5-http-client';

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

  async prompt(params: any) {
    console.log('params', params);
    const { model = 'gpt-3.5-turbo', content } = params;
    const messages = this.history.concat([{ role: "user", content }]);
    const chatCompletion = await this.openai.createChatCompletion({
      model,
      messages,
    }, { timeout: 30000 });
    console.log('messages', messages);
    const result = chatCompletion.data.choices[0].message;
    this.history.push(result);
    return result;
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
