import type { EmailCodeDTO, LoginDTO, LoginVO, RegisterDTO } from './types';
import { post } from '@/utils/request';

export const login = (data: LoginDTO) => post<LoginVO>('/auth/login', data);

// 邮箱验证码
export const emailCode = (data: EmailCodeDTO) => post('/resource/email/code', data);

// 注册账号
export const register = (data: RegisterDTO) => post('/auth/register', data);
