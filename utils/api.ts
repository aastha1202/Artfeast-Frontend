/* eslint-disable prettier/prettier */
import { API_URL } from '@env';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'
import {decode} from 'base-64'
const instance = axios.create({
  baseURL: `${API_URL}`,
});

if(!global.atob){
  global.atob= decode
}


export const setAuthorizationHeader = (token : string) => {
  if (token) {
    const decodedToken = jwtDecode(token) as { exp: number };
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    console.log(expirationTime, currentTime)
    if (expirationTime < currentTime) {
      // Token has expired, remove it from headers
      delete instance.defaults.headers.common['Authorization'];
      console.log('Token has expired');
    } else {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export default instance;
