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


export const genRandomNumberCodeString = (length = 4) => {
  if (length < 4) throw new Error('code should has a length at least 4');
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1)))
    + '';
}

export const confoundMobile = (mobile: string) => {
  return mobile?.replace(/^(\d{3})(\d{5})(\d{3})$/, '$1***$2');
}