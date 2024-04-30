import Config from 'react-native-config';
import {store} from "../../redux/store";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

//@ts-ignore
const {punchh_client_id: client = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
export const getMessagesRequest = async () => {
  try {
    return axiosPunchhInstance
      .get(`/api2/mobile/messages?client=${client}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const dismissMessage = async (id: string) => {
  try {
    return axiosPunchhInstance
      .delete(`/api2/mobile/message_readerships/${id}?client=${client}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (e) {
    throw e;
  }
};

export const markMessagesAsRead = async (id: string): Promise<any> => {
  const body = {
    user_rich_notifications: id,
  };
  try {
    return axiosPunchhInstance
      .post( `/api2/mobile/message_readerships?client=${client}`, body)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  } catch (e) {
    throw e;
  }
};
