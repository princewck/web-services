import { Injectable } from '@nestjs/common';
import { PinyinMappingInfo } from './typing';
import * as pinyinJSON from './pinyin.json';
import { GptService } from '../gpt/gpt.service';

@Injectable()
export class PinyinService {


  constructor(private readonly gptService: GptService) {

  }

  private pinyinMapping: PinyinMappingInfo = pinyinJSON;

  async getPinyin(words: string, tune?: string) {
    // 如果需要声调, 全部交给 gpt 完成
    if (tune === '1') return await this.getPinyinByGPT(words);
    let result: any = [];
    const arr = decodeURIComponent(words).split('');
    let multiProunce = false; // 存在多音字
    for (let i = 0; i < arr.length; i++) {
      const chineseReg = /[\u4e00-\u9fa5]/gm;
      const item = arr[i];
      if (!chineseReg.test(item)) {
        result.push(item);
        continue;
      }
      const pinyin = this.pinyinMapping[item];
      if (!pinyin) {
        result.push(item);
      }
      // 多音字, 直接丢给 AI 处理
      if (pinyin.length > 1) {
        multiProunce = true;
        break;
      }
      result.push(pinyin?.[0].pinyin);
    }
    if (multiProunce) {
      return await this.getPinyinByGPT(words);
    }
    return result;
  }

  private async getPinyinByGPT(words: string) {
    try {
      const res = await this.gptService.askMessages([
        { role: 'user', content: '你好, 你是一个语文老师, 下面我会说一句话, 你都会告诉我它的拼音表示结果,并且除此以外你不会多说任何一个字, 比如“你好”表示为 nǐ hǎo, 准备好了吗?' },
        { role: 'assistant', content: '好的，我已经准备好了。请你说出你想查询的句子，我将只回复其拼音表示结果。' },
        { role: 'user', content: words },
      ]);
      return {
        result: res.output?.text ?? null
      };
    } catch (e) {
      console.error(e);
      throw new Error('转换失败');
    }
  }
}
