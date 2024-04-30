import {store} from '../../redux/store';
import Config from 'react-native-config';
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";
export const requestRewards = () => {
  try {
    //@ts-ignore
    const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
    const url = `/api2/mobile/users/balance?client=${punchh_client_id}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};

//TODO Api and Params will change
export const requestRewardsNew = () => {
  const authToken = store.getState().auth.authToken.authtoken;
  try {
    //@ts-ignore
    const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
    const url = `/api/auth/checkins/balance?client=${punchh_client_id}&authentication_token=${authToken}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};

export const requestRewardsLocked = () => {
  try {
    //@ts-ignore
    const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
    const url = `/api2/mobile/meta.json?client=${punchh_client_id}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};

export const testingRedemption = (id: string, points: any) => {
  //@ts-ignore
  const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};
  const body = {
    client: punchh_client_id,
    reward_id: id,
    redeemed_points: points,
  };
  try {
    // @ts-ignore
    const authentication_token = store.getState()?.provider?.providerToken?.access_token.token;

    const url = `/api/auth/redemptions?authentication_token=${authentication_token}`;
    return axiosPunchhInstance
      .post(url, body)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};
