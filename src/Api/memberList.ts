import { handleError, handleResponse, serializeData } from './utils.ts';
import { generalApi } from './common.ts';


export const memberApiService = {
    // 获取学生列表
    getStudentList: (class_id: string, query_count: number, query_word: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('user/getList', {
                params: {
                    class_id,
                    query_count,
                    query_word
                }
            })
                .then(response => handleResponse(response, resolve, reject, [0, 1]))
                .catch(error => handleError(error, reject));
        });
    },

    // 获取班级列表
    getClassList: () => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('class/getList')
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    getClassIdByName: (class_name: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('class/getId', serializeData({
                class_name
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 批量添加学生（Excel导入）
    batchAddStudents: (data: any[]) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/add', serializeData({
                data: JSON.stringify(data)
            }))
                .then(response => handleResponse(response, resolve, reject, [0, 2]))
                .catch(error => handleError(error, reject));
        });
    },

    // 添加单个学生
    addStudent: (data: Array<{
        name: string;
        account: string;
        password: string;
        class_id: string;
    }>) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/add', serializeData({
                data: JSON.stringify(data)
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 删除学生（单个或批量）
    deleteStudent: (student_list: string[]) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/delete', serializeData({
                student_list: JSON.stringify(student_list)
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 编辑学生信息
    editStudent: (account: string, name: string, class_id: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/edit', serializeData({
                account,
                name,
                class_id
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 修改密码
    changePassword: (account: string, password: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('user/editPassword', serializeData({
                account,
                password
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 获取用户数量
    getStudentCount: (class_id: string, query_word: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('user/getCount', {
                params: {
                    class_id,
                    query_word
                }
            })
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    }
};
