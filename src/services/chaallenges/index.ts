import Config from 'react-native-config';
import {store} from '../../redux/store';
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

//@ts-ignore
const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};

export const getChallenges = (): any => {
  try {
    const url = `/api2/mobile/challenges?client=${punchh_client_id}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};

export const getChallengeDetail = (id: any): any => {
  try {
    //@ts-ignore
    const access_token = store?.getState()?.provider?.providerToken?.access_token.token;
    const url = `/api2/mobile/challenges/${id}?client=${punchh_client_id}&access_token=${access_token}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};
