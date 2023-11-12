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
    console.time('preparedWords');
    let py = '';
    let preparedWords = words?.split('').map(c => {
      const chineseReg = /[\u4e00-\u9fa5]/gm;
      const isPY = chineseReg.test(c);
      if (!isPY) return ' ';
      const info = this.pinyinMapping[c];
      if (info.length === 1) {
        py += info[0].pinyin + ' ';
        return c;
      }
      // 多音字返回
      py += '? ';
      return c;
    }).join('');
    preparedWords = preparedWords.replace(/\s+$/gm, '');
    if (py) {
      preparedWords = preparedWords + '  ' + py;
    }
    console.log('preparedWords', preparedWords);
    console.timeEnd('preparedWords');
    try {
      const system = '返回 json 字符串, 严格确保返回内容只有拼音, 即返回内容不允许包含中文和任何特殊标点符号, 请严格确保声调正确, 并且中文字数和拼音一一对应不要添加多余内容,严格确保 json 语法正确';
      const messages = [
        { role: 'user', content: '你好, 你是一个汉语专家, 下面我会告诉你一句中文并附上上不完善的拼音, 请帮我完善?处的多音字并注明音调, 请用 json 的格式返回结果 { result: "拼音结果" }' },
        { role: 'assistant', content: '好的，我已经准备好了。请你说出你想查询的句子，我会先补全拼音, 然后只回复其拼音表示结果。' },
        { role: 'user', content: '行行出状元  ? ? chu zhuang yuan' },
        { role: 'assistant', content: '{"result": "háng háng chū zhuàng yuán"}' },
        { role: 'user', content: '对, 这就是我要的 json 格式, 后续都按上一条的 json 格式返回, 接下来请帮我看下下面这个词:' + preparedWords },
      ];
      console.log('messages ', messages);
      const res = await this.gptService.askMessagesBD(messages, true, system);
      const json = res?.result?.replace(/[\u4e00-\u9fa5]/gm, '')
        ?.replace(/[^{}]*({[^{}]+})[^{}]*/g, '$1')
        ?.replace(/"\s+/, '"')
        ?.replace(/\s+"/, '"');

      console.log('json', json);
      try {
        return JSON.parse(json);
      } catch (e) {
        console.error(e);
        console.log(json + 'is not valid json');
      }
    } catch (e) {
      console.error(e);
      throw new Error('转换失败');
    }
  }
}
