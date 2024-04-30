import axios from 'axios';
import {store} from '../../redux/store';
import {isIos} from '../../utils/sharedUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logToConsole} from "../../configs";
import Config from "react-native-config";
import {Platform} from "react-native";

const axiosOloInstance = axios.create();

axiosOloInstance.interceptors.request.use(
  async function (config) {
    try {
      const {
        //@ts-ignore
        base_url,
        //@ts-ignore
        olo_prefix,
        //@ts-ignore
        api_prefix
      } = store.getState().firebaseConfig?.config || {};

      const endpoint = config.url || '';
      config.url = `${base_url}${api_prefix}${olo_prefix}${endpoint}`;

      const deviceId = await AsyncStorage.getItem('uniqueId');
      // @ts-ignore
      config.headers = {
        ...config.headers,
        'X-Device-Id': deviceId,
        platform: isIos ? 'IOS' : 'ANDROID',
        "Content-Type": 'application/json',
        "User-Agent": `Rubios-${Platform.OS}/1.0`,
      };
      return config;
    } catch (e: any) {
      logToConsole({e: e.message})
      throw e;
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosOloInstance;
