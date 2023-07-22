export function commonDBErrorMsg(message: string) {
  if (!message) return 'Failed';
  const match = message?.match(/ER_DUP_ENTRY: Duplicate entry '(.+)' for key '(.+)'/);
  console.log('match', match);
  if (match) {
    return `[${match[1]}] 已存在`;
  }
  return message;
}