import {store} from '../../../redux/store';
import Config from 'react-native-config';
import axiosPunchhInstance from "../../axiosInterceptor/axiosPunchhInstance";

//@ts-ignore
const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};

export const requestRewardRedemptionCode = (id: string) => {
  const body = {
    client: punchh_client_id,
    reward_id: id,
  };

  try {
    const url = `/api2/mobile/redemptions/reward`;
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

export const requestRedeemableRedemptionCode = (id: number) => {
  const body = {
    client: punchh_client_id,
    redeemable_id: id,
  };
  try {
    const url = `/api2/mobile/redemptions/redeemable`;
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
