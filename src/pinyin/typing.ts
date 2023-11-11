export type PinyinItem = {
  pinyin: string;
  short: string;
}

export type PinyinInfo = PinyinItem[];

export type PinyinMappingInfo = Record<string, PinyinInfo>;