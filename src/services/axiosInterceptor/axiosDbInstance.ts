import axios from 'axios';
import {store} from '../../redux/store';
import {isIos} from '../../utils/sharedUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logToConsole} from "../../configs";
import {Platform} from "react-native";

export const axiosDbInstance = axios.create();

axiosDbInstance.interceptors.request.use(
    async function (config) {
        try {
            //@ts-ignore
            const {base_url, api_prefix} = store.getState().firebaseConfig?.config || {};

            const endpoint = config.url || '';
             config.url = `${base_url}${api_prefix}${endpoint}`;
            const deviceId = await AsyncStorage.getItem('uniqueId');
            // @ts-ignore
            config.headers = {
                ...config.headers,
                'punchh-app-device-id': deviceId,
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

export default axiosDbInstance;
