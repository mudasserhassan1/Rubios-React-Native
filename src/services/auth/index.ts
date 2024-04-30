import {store} from '../../redux/store';
import axiosOloInstance from '../axiosInterceptor';

export const getAuthToken = async (basketID: string = ''): Promise<any> => {
  //@ts-ignore
    const providertoken = store.getState().provider.providerToken.access_token.token;
    //@ts-ignore
    const {email, first_name: fName = '', last_name: lName = '', phone: contactNumber = ''} = store.getState().provider.providerToken.user || {};
  const url = '/users/getorcreate';
  return axiosOloInstance.post(
    url,
    {
      provider: 'punchh',
      providertoken: providertoken,
      firstname: fName,
      lastname: lName,
      emailaddress: email,
      basketid: basketID,
      contactnumber: contactNumber,
    },
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
};
