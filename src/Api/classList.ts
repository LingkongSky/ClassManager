import { requestWithHandler, serializeData } from './utils.ts';
import { generalApi } from './common.ts';

export const classApiService = {

    // 获取筛选后的班级表格
    getSortClassContent: (query_count: number, query_word: string, sort_mode: string, sort_field?: string) => {
        return requestWithHandler<any>(
            generalApi.get('class/get', {
                params: {
                    query_count,
                    query_word,
                    sort_mode,
                    sort_field
                }
            })
        );
    },
    // 获取班级表格
    getClassContent: (query_count: number, query_word: string) => {
        return requestWithHandler<any>(
            generalApi.get('class/get', {
                params: {
                    query_count,
                    query_word
                }
            })
        );
    },

    // 获取班级总数
    getClassCount: (query_word: string) => {
        return requestWithHandler<any>(
            generalApi.get('class/getCount', {
                params: {
                    query_word
                }
            })
        );
    },
    
    // 添加班级
    addClass: (class_list: Array<{ class_name: string }>) => {
        return requestWithHandler<any>(
            generalApi.post('class/add', serializeData({
                class_list: JSON.stringify(class_list)
            }))
        );
    },

    // 编辑班级
    editClass: (class_id: string, class_name: string) => {
        return requestWithHandler<any>(
            generalApi.post('class/edit', serializeData({
                class_id,
                class_name
            }))
        );
    },

    // 删除班级（单条或批量）
    deleteClass: (class_list: string[]) => {
        return requestWithHandler<any>(
            generalApi.post('class/delete', serializeData({
                class_list: JSON.stringify(class_list)
            }))
        );
    },

};
