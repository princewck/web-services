const data = {
  "a": ["ā", "á", "ǎ", "à"],
  "o": ["ō", "ó", "ǒ", "ò"],
  "e": ["ē", "é", "ě", "è"],
  "i": ["ī", "í", "ǐ", "ì"],
  "u": ["ū", "ú", "ǔ", "ù"],
  "u:": ["ǖ", "ǘ", "ǚ", "ǜ", "v"],
}

const mapping: any = {};

Object.keys(data).forEach(key => {
  const arr = data[key];
  arr.forEach(py => {
    mapping[py] = key;
  });
});


const removeTune = (pinyin: string) => {
  return pinyin?.split('').map(i => {
    if (mapping[i]) return mapping[i];
    return i;
  }).join('');
}