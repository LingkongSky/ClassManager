import axios from 'axios';
import { ClassManagerSite } from '../global.ts';
import { handleError, handleResponse, serializeData } from './utils.ts';
import { PasswordHash } from '../Module/PasswordCrypto.ts';

const loginApi = axios.create({
  baseURL: `${ClassManagerSite}/`,
});

export const loginApiService = {

  // 用户登录
  login: (account: string, passwd: string, remember: Boolean) => {
    return new Promise<any>((resolve, reject) => {
      loginApi.post('auth/login', serializeData({
        account,
        password: PasswordHash(passwd),
        remember: remember ? 1 : 0
      }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },
  // 获取用户数量
  getUserCount: () => {
    return new Promise<any>((resolve, reject) => {
      loginApi.get('auth/getUserCount')
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  }
  
};