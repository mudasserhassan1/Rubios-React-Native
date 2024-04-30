import {store} from '../../redux/store';
import axiosOloInstance from '../axiosInterceptor';

export const requestCreateFave = (body: RequestNewFave) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .post(`/users/${authtoken}/faves`, body)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
