import Config from 'react-native-config';
import axiosOloInstance from '../../../axiosInterceptor';

export const applyRewardsByTokenAndVendorID = (basketID: string, body: any) => {
  try {
    return axiosOloInstance
      .put(`/baskets/${basketID}/loyaltyrewards/byref`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
