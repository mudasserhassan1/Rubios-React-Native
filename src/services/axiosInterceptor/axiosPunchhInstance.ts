import axios from 'axios';
import {store} from '../../redux/store';
import {isIos} from '../../utils/sharedUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logToConsole} from "../../configs";
import {Alert, Platform} from "react-native";
import {userLogout} from "../../redux/actions/user";
export const axiosPunchhInstance = axios.create();

let isErrorDisplayed = false;
const withoutTokenEndpoints = [
    '/api2/mobile/users',
    '/api2/mobile/users/login',
    '/api2/mobile/users/forgot_password',
    '/api/auth/users/change_password',
    '/api2/mobile/users/connect_with_facebook',
    '/api2/mobile/apple_registrations',
    '/api2/dashboard/locations',
];

axiosPunchhInstance.interceptors.request.use(
    async function (config) {
        try {
            const {
                //@ts-ignore
                base_url,
                //@ts-ignore
                punchh_prefix,
                //@ts-ignore
                api_prefix
            } = store.getState().firebaseConfig?.config || {};

            let endpoint: any = config.url || '';
            config.url = `${base_url}${api_prefix}${punchh_prefix}${endpoint}`;
             // = url;
            const deviceId = await AsyncStorage.getItem('uniqueId');
            endpoint = endpoint?.toString().split('?');
            logToConsole({endpointAfterConfig: endpoint})
            if (!withoutTokenEndpoints.includes(endpoint[0])) {
                // @ts-ignore
                const {access_token = {}} = store.getState()?.provider?.providerToken || {};
                const {token = ''} = access_token || {};
                if (token) {
                    // @ts-ignore
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token || ''}`,
                    };
                }
            }

            // @ts-ignore
            config.headers = {
                ...config.headers,
                'punchh-app-device-id': deviceId,
                 platform: isIos ? 'IOS' : 'ANDROID',
                "Content-Type": 'application/json',
                "User-Agent": `Rubios-${Platform.OS}/1.0`,
                // 'punchh-app-device-id': moment().unix(),
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


axiosPunchhInstance.interceptors.response.use((response) => {
    return response;
}, (error) =>{
    const {status, config = {}} = error?.response || {};
    const {url = ''} = config || {};
    const endPoint = url.split('/punchh_api')[1];
    const isChangePasswordApi = endPoint?.includes('change_password') ?? false;
    if (status === 401 && !isErrorDisplayed && !isChangePasswordApi) {
        isErrorDisplayed = true;
        Alert.alert('Session Expired', 'Your active session has been expired. You need to login again.', [
            {
                text: 'Ok',
                onPress: () => {
                    store.dispatch(userLogout());
                    isErrorDisplayed = false;
                }
            }
        ])
    } else {
        throw error;
    }
})

export default axiosPunchhInstance;
