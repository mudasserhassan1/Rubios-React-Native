import {store} from '../../redux/store';
import axiosOloInstance from '../axiosInterceptor';
import {ResponseContactOptions} from '../../types/olo-api';
import axios from 'axios';
import {deleteUserFromDb} from '../otp';
import {isIos} from '../../utils/sharedUtils';
import Config from "react-native-config";
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

//@ts-ignore
const {punchh_client_id = Config.REACT_APP_PUNCHH_CLIENT_ID} = store.getState().firebaseConfig.config || {};

export const RequestUserProfile = (): any => {
  try {
    // @ts-ignore
    const access_token = store?.getState().provider.providerToken.access_token.token;
    const url = `/api/auth/users?client=${punchh_client_id}&access_token=${access_token}`;
    return axiosPunchhInstance.get(url).then(response => response.data);
  } catch (error) {
    throw error;
  }
};

//Update user profile
export const requestUpdateUser = (body: object) => {
  // @ts-ignore
  const token = store.getState()?.provider?.providerToken?.access_token.token;
  const obj = {
    user: body,
    client: punchh_client_id,
    authentication_token: token,
  };
  try {
    const url = `/api/auth/users`;

    return axiosPunchhInstance
      .put(url, obj)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

//Update user profile from Profile Screen
export const requestUpdateProfile = (body: object) => {
  const obj = {
    user: body,
    client: punchh_client_id,
  };
  // @ts-ignore
  const authToken = store.getState()?.provider?.providerToken?.access_token.token;
  try {
    const url = `/api2/mobile/users`;
    return axiosPunchhInstance
      .put(url, obj, {headers: {Authorization: `Bearer ${authToken}`}})
      .then(response => response.data)
      .catch(error => {
        console.log(error.response.data.errors);
        throw error.response.data.errors;
      });
  } catch (error) {
    throw error;
  }
};

//Change Password
export const requestChangePassword = (body: object) => {
  // @ts-ignore
  const token = store.getState().provider.providerToken.access_token.token;
  const obj = {
    user: body,
    client: punchh_client_id,
    authentication_token: token,
  };

  try {
    const url = `/api/auth/users/change_password`;
    return axiosPunchhInstance
      .patch(url, obj)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

//Reset Password
export const resetPasswordRequest = (body: object, reset_password_token: string) => {
  const obj = {
    user: body,
    client: punchh_client_id,
    reset_password_token: reset_password_token,
  };

  try {
    const url = `/api/auth/users/change_password`;
    return axiosPunchhInstance
      .patch(url, obj)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

//Recent Orders
export const requestUserRecentOrders = () => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .get( `/users/${authtoken}/recentorders`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//Favorite Orders
export const requestUserFavoriteOrders = () => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .get(`/users/${authtoken}/faves`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//DELETE FAV order
export const requestDeleteFavOrder = (favid: number) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .delete( `/users/${authtoken}/faves/${favid}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//Delivery Addresses
export const requestUserDeliiveryAddresses = () => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .get(`/users/${authtoken}/userdeliveryaddresses`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//Set Default Delivery Address
export const requestSetUserDefDelAddress = (body: RequestUserDefaultAddress) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .put( `/users/${authtoken}/userdeliveryaddresses/default`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
//Delete User Delivery address

export const requestDelUserDelAddress = (addressid: number) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .delete( `/users/${authtoken}/userdeliveryaddresses/${addressid}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//Get User Billing accounts

export const requestUserBillingAccount = () => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .get( `/users/${authtoken}/billingaccounts`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

// export const requestUserBillingAccount = () => {
//     const url = `/api2/mobile/gift_cards/?client=${punchh_client_id}&passcode=123456`;
//     return axiosPunchhInstance
//       .get(url)
//       .then(response => response.data)
//       .catch(error => {
//         throw error.response;
//       });
//   } catch (error) {
//     throw error;
//   }
// };

//Get User Billing account by id (Api not Valid)

export const requestUserBillingAccountById = (billingAccountId: number) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .get( `/users/${authtoken}/billingaccount/${billingAccountId}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

// Delete Billing Account

export const deleteUserBillingAccount = (billingAccountId: number) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .delete( `/users/${authtoken}/billingaccounts/${billingAccountId}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

// Update Billing Account
export const updateUserBillingAccount = (body: any, billingAccountId: number) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .put( `/users/${authtoken}/creditcards/${billingAccountId}`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//Get User Gift Card

export const requestUseGiftCards = () => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .get(`/users/${authtoken}/billingaccounts/storedvalue`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const updateUserContactOptions = (body: ResponseContactOptions) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .put( `/users/${authtoken}/contactoptions`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

//User Login
export const requestUserLogin = async (body: object) => {
  const {fcmToken = ''} = store.getState()?.token;
  const data = {
    user: isIos ? {...body, apn_token: fcmToken} : {...body, gcm_token: fcmToken},
    client: punchh_client_id,
  };
  try {
    const url = `/api2/mobile/users/login`;
    return axiosPunchhInstance
      .post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

//User Register
export const requestUserRegister = (body: object) => {
  const {fcmToken = ''} = store.getState().token;
  const data = {
    user: isIos ? {...body, apn_token: fcmToken} : {...body, gcm_token: fcmToken},
    client: punchh_client_id,
  };

  try {
    const url = `/api2/mobile/users`;
    return axiosPunchhInstance
      .post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

export const requestAppleSignup = (body: object) => {
  const {fcmToken = ''} = store.getState()?.token;
  const data = {
    user: isIos ? {...body, apn_token: fcmToken} : {...body, gcm_token: fcmToken},
  };
  try {
    const url = `/api2/mobile/apple_registrations`;
    return axiosPunchhInstance
      .post(url, data, {params: {client: punchh_client_id}})
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};
//User Forgot Password
export const requestUserForgotPassword = (body: object) => {
  const data = {
    user: body,
    client: punchh_client_id,
  };

  try {
    const url = `/api2/mobile/users/forgot_password`;
    return axiosPunchhInstance
      .post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

export const requestGiftCardBalance = async (billingAccountIds: any) => {
  try {
    const authtoken = store.getState().auth.authToken.authtoken;
    const requests: any = [];
    billingAccountIds.forEach((id: any) => {
      requests.push(
        axiosOloInstance.get(`/users/${authtoken}/billingaccounts/storedvalue/${id}`),
      );
    });

    const promisesResolved = requests.map((promise: any) =>
      promise.catch((error: any) => ({error})),
    );

    const checkFailed = (then: any) => {
      return function (responses: any) {
        const someFailed = responses.some((response: any) => response.error);

        if (someFailed) {
          throw responses;
        }

        return then(responses);
      };
    };

    const finalResponse = axios
      .all(promisesResolved)
      .then(
        checkFailed((response: any) => {
          console.log('SUCCESS', response);
          return response;
        }),
      )
      .catch(err => {
        console.log('FAIL', err);
        return err;
      });

    return await finalResponse;
  } catch (error) {
    throw error;
  }
};

//Facebook User Login
export const requestFacebookUserLogin = (body: object) => {
  const {fcmToken = ''} = store.getState()?.token;
  const data = {
    user: isIos ? {...body, apn_token: fcmToken} : {...body, gcm_token: fcmToken},
    client: punchh_client_id,
  };
  try {
    const url = `/api2/mobile/users/connect_with_facebook`;
    return axiosPunchhInstance
      .post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw error.response;
      });
  } catch (error) {
    throw error;
  }
};

export const requestEclubSignup = (body: object) => {
  try {
    const url = '/api2/dashboard/eclub_guests';

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

export const requestDeleteUser = () => {
  try {
    // @ts-ignore
    const authtoken = store.getState()?.provider?.providerToken?.access_token.token;
    const url = `/api2/mobile/users`;
    const data = {
      client: punchh_client_id,
    };
    return axiosPunchhInstance
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authtoken}`,
        },
        data,
      })
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const deleteUserFromOlo = async () => {
  const authtoken = store.getState().auth.authToken.authtoken;
  // @ts-ignore
  const {phone = ''} = store?.getState()?.provider?.providerToken?.user || {};
  try {
    let response = await axiosOloInstance.delete( `/users/${authtoken}/account`);
    if (phone) {
      await deleteUserFromDb(`+1${phone?.replace(/\D/g, '')}`);
    }
    return response.data;
  } catch (error: any) {
    console.log(error.response);
    throw error;
  }
};

export const userLogoutApi = async () => {
  const url = `/api2/mobile/users/logout`;
  // @ts-ignore
  const accessToken = store.getState()?.provider?.providerToken?.access_token.token;
  const client = punchh_client_id;
  const data: any = {
    client,
    access_token: accessToken,
  };
  try {
    let response = await axiosPunchhInstance.delete(url, {data});
    return response?.data;
  } catch (error: any) {
    console.log(error.response);
    throw error;
  }
};
