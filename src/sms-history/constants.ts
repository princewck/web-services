import { isDev } from "../utils";

export const CODE_ERROR_COMMON = '验证码错误';
export const CODE_NOT_EXISTS_ERROR = isDev ? '验证码不存在' : CODE_ERROR_COMMON;
export const CODE_MISMATCH_ERROR = CODE_ERROR_COMMON;
export const CODE_EXPIRED_ERROR = '验证码已过期';