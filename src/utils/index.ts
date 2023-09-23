import { createHash } from "crypto";

export const encryptPwd = (pwd: string, salt: string) => {
  const pwdStr = pwd + salt;
  const hash = createHash('md5');
  return hash.update(pwdStr).digest('base64');
}

export const isPwdCorrect = (input: string, salt: string, realPwdEncrypted: string) => {
  const inputEncrypted = encryptPwd(input, salt);
  return inputEncrypted === realPwdEncrypted;
}