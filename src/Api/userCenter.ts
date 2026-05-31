import { handleError, handleResponse, serializeData } from './utils.ts';
import { PasswordHash } from '../Module/PasswordCrypto.ts';
import { generalApi } from './common.ts';


export const userCenterApiService = {

    // 获取用户个人信息
    getUserInfo: () => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('user/me')
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 用户修改密码
    editPassword: (account: string, passwd: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/editPassword', serializeData({
                account,
                password: PasswordHash(passwd),
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },
    // 退出登录
    exitLogin: () => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/logout')
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

};