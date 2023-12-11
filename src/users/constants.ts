import { isDev } from "../utils";

export const COMMON_LOGIN_ERROR = '用户名或密码不正确';
export const LOGIN_SMS_CODE_ERROR = '验证码错误';
export const COMMON_PARAMS_ERROR = '参数错误';

export const REGISTER_ERROR_USERNAME_EXISTS = isDev ? '用户已存在' : COMMON_LOGIN_ERROR;
export const PASSWORD_ERROR = isDev ? '密码错误' : COMMON_LOGIN_ERROR;
export const USER_NOT_EXISTS = isDev ? '用户不存在' : COMMON_LOGIN_ERROR;