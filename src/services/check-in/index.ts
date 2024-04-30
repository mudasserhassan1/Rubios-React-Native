import {store} from "../../redux/store";
import Config from "react-native-config";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

export const requestCreateCheckIn = (action: any) => {
  //@ts-ignore
  const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
  const body = {
    bar_code: action?.qrvalue,
    client: punchh_client_id,
  };
  try {
    const url = `/api2/mobile/checkins/barcode`;
    return axiosPunchhInstance
      .post(url, body)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
