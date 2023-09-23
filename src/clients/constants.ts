export const COMMON_LOGIN_ERROR = '用户名或密码不正确';

export const USERNAME_EXISTS = process.env.NODE_ENV === 'development' ? '用户已存在' : COMMON_LOGIN_ERROR;
export const PASSWORD_ERROR = process.env.NODE_ENV === 'development' ? '密码错误' : COMMON_LOGIN_ERROR;