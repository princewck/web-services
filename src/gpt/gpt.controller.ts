import { Controller, Get, Header, Post, Sse, Request, Req } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {

  }

  @Post('prompt')
  @Sse('prompt')
  @Header('content-type', 'text/event-stream')
  prompt(@Request() req) {
    console.log('req.body', req.body);
    return this.gptService.prompt(req.body);
  }

  @Post('prompt2')
  async sendPrompt(@Request() req) {
    return await this.gptService.prompt2(req.body);
  }


  @Get('models')
  getModels(@Request() req) {
    const body = req.body;
    return this.gptService.models();
  }

  @Post('ask/json')
  askOneJson(@Req() req) {
    const body = req.body;
    if (process.env.NODE_ENV !== 'development') return { "message": "not available" };
    return this.gptService.askOneJSON(`字符串“${body?.value}”的拼音是什么`, { chinese: 'string', pinyin: 'string' });
  }


}
