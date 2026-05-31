import axios from 'axios';
import { ClassManagerSite } from '../global.ts';
import { getCookie } from '../Module/LocalStorage.ts';

export const generalApi = axios.create({
    baseURL: `${ClassManagerSite}/`,
      headers: {
          Authorization: getCookie("token_type") + " " + getCookie("token")
      }
});
