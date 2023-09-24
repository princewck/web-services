import { isDev } from "../utils";

export const COMMON_LOGIN_ERROR = '用户名或密码不正确';

export const REGISTER_ERROR_USERNAME_EXISTS = isDev ? '用户已存在' : COMMON_LOGIN_ERROR;
export const PASSWORD_ERROR = isDev ? '密码错误' : COMMON_LOGIN_ERROR;
export const USER_NOT_EXISTS = isDev ? '用户不存在' : COMMON_LOGIN_ERROR;