import {store} from '../../redux/store';
import Config from "react-native-config";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

export const getProviderToken = async (): Promise<any> => {
  //@ts-ignore
  const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
  //@ts-ignore
  const authtoken = store.getState().token.accessToken.access_token;
  const url = `/api/auth/users?client=${punchh_client_id}&access_token=${authtoken}`;
  return axiosPunchhInstance.get(url);
};
