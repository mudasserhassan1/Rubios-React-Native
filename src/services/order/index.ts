import {store} from '../../redux/store';
import axiosOloInstance from '../axiosInterceptor';

//Get Order By id
export const requestOrderById = (orderGuid: string) => {
  try {
    return axiosOloInstance
      .get(`/orders/${orderGuid}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//Submit OrderFeedBack
export const submitOrderFeedBackRequest = (body: object) => {
  try {
    const url =  '/feedback' || '';
    const authtoken = store?.getState()?.auth?.authToken?.authtoken;
    const obj = {
      ...body,
      authtoken: authtoken,
    };
    return axiosOloInstance
      .post(url, obj)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
