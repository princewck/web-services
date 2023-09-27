import { createHash } from "crypto";

export const encryptPwd = (pwd: string, salt: string) => {
  const pwdStr = pwd + salt;
  const hash = createHash('md5');
  return hash.update(pwdStr).digest('base64');
}

export const isPwdCorrect = (password: string, salt: string, realPwdEncrypted: string) => {
  const inputEncrypted = encryptPwd(password, salt);
  return inputEncrypted === realPwdEncrypted;
}

export const isDev = process.env.NODE_ENV === 'development';