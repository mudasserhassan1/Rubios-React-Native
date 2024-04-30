import Config from 'react-native-config';
import {store} from "../../redux/store";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

export const getOffers = () => {
  //@ts-ignore
  const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
  try {
    const url = `/api2/mobile/offers?client=${punchh_client_id}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};
