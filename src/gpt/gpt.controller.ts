import { Controller, Get, Post, Request } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {

  }

  @Post('prompt')
  sendPrompt(@Request() req) {
    const body = req.body;
    console.log('body', body);
    return this.gptService.prompt(body);
  }

  @Get('models')
  getModels(@Request() req) {
    const body = req.body;
    console.log('body', body);
    return this.gptService.models();
  }


}
