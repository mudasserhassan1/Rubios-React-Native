import axios from "../axiosInterceptor";
import {store} from "../../redux/store";
import Config from "react-native-config";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";


export const getToken = async (code: string): Promise<any> => {
    //@ts-ignore
    const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
  return axiosPunchhInstance.post(
    `/fetchoauthinfo`,
    {
      grant_type: "authorization_code",
      code: code,
      client_id: punchh_client_id,
      redirect_uri: "https://dpropt.com/login"
    },
    );
  };
