import { handleError, handleResponse, serializeData } from './utils.ts';
import { generalApi } from './common.ts';

export const classApiService = {

    // 获取筛选后的班级表格
    getSortClassContent: (query_count: number, query_word: string, sort_mode: string, sort_field?: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('class/get', {
                params: {
                    query_count,
                    query_word,
                    sort_mode,
                    sort_field
                }
            })
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },
    // 获取班级表格
    getClassContent: (query_count: number, query_word: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('class/get', {
                params: {
                    query_count,
                    query_word
                }
            })
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 获取班级总数
    getClassCount: (query_word: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.get('class/getCount', {
                params: {
                    query_word
                }
            })
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },
    
    // 添加班级
    addClass: (class_list: Array<{ class_name: string }>) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('class/add', serializeData({
                class_list: JSON.stringify(class_list)
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 编辑班级
    editClass: (class_id: string, class_name: string) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('class/edit', serializeData({
                class_id,
                class_name
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

    // 删除班级（单条或批量）
    deleteClass: (class_list: string[]) => {
        return new Promise<any>((resolve, reject) => {
            generalApi.post('class/delete', serializeData({
                class_list: JSON.stringify(class_list)
            }))
                .then(response => handleResponse(response, resolve, reject))
                .catch(error => handleError(error, reject));
        });
    },

};