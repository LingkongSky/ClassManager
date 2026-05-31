import { handleError, handleResponse, serializeData } from './utils.ts';
import { generalApi } from './common.ts';


export const permissionEditApi = {
  // 获取管理员列表
  getAdminList: (query_count: number, query_word: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.get('permissionEdit/getAdminList', {
        params: {
          query_count,
          query_word
        }
      })
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 获取管理员数量
  getAdminCount: (query_word: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.get('permissionEdit/getCount', {
        params: {
          query_word
        }
      })
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 获取权限组列表
  getPermissionsGroupList: () => {
    return new Promise<any>((resolve, reject) => {
      generalApi.get('permissionGroup/getList')
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 编辑管理员信息
  editAdmin: (account: string, name: string, class_id: string, permissions_group_id: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionEdit/editAdmin', serializeData({
        account,
        name,
        class_id,
        permissions_group_id
      }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 删除管理员
  deleteAdmin: (admin_list: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionEdit/deleteAdmin', serializeData({admin_list }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 设置管理员
  setAdmin: (admin_list: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionEdit/setAdmin', serializeData({ admin_list }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 新增管理员用户
  addAdminUser: (data: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionEdit/addAdmin', serializeData({ data }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 编辑管理员密码
  editAdminPassword: (account: string, password: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionEdit/editAdminPassword', serializeData({ account, password }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  }
};

// 权限组相关接口
export const permissionGroupApi = {

  // 获取权限组
  getPermissionsGroupList: (query_count: number, query_word: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.get('permissionGroup/getGroupList', {
        params: {
          query_count,
          query_word
        }
      })
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 获取权限组数量
  getPermissionsGroupCount: (query_word: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.get('permissionGroup/getCount', {
        params: {
          query_word
        }
      })
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },


  // 增加权限组
  addPermissionsGroup: (permissions_group_list: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionGroup/addGroup', serializeData({
        permissions_group_list
      }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 编辑权限组
  editPermissionsGroup: (permissions_group_id: string, permissions_group_name: string, class_list: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionGroup/editGroup', serializeData({
        permissions_group_id,
        permissions_group_name,
        class_list
      }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // 删除权限组
  deletePermissionsGroup: (permissions_group_list: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionGroup/deleteGroup', serializeData({
        permissions_group_list
      }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  },

  // xlxs提交管理员列表
  addPermissionsGroupList: (permissions_group_list: string) => {
    return new Promise<any>((resolve, reject) => {
      generalApi.post('permissionGroup/addGroup', serializeData({
        permissions_group_list
      }))
        .then(response => handleResponse(response, resolve, reject))
        .catch(error => handleError(error, reject));
    });
  }
};