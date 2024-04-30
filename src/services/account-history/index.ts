import {store} from "../../redux/store";
import Config from "react-native-config";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";


export const requestAccountHistory = (event_filter: string = '') => {
  //@ts-ignore
  const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
  try {
    const url = `/api2/mobile/users/account_history?client=${punchh_client_id}&event_filter=${event_filter}`;
    return axiosPunchhInstance
      .get(url)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
