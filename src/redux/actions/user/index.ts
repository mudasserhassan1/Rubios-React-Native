import {userTypes as Type} from '../../types/user';
import {
  ResponseRecentOrders,
  ResponseUserDeliveryAddresses,
  ResponseUserFaves,
  ResponseUserBillingAccounts,
} from '../../../types/olo-api';
import {displayToast} from '../../../helpers/toast';
import {Alert} from 'react-native';
import {logToConsole} from "../../../configs";

export function setUserAccessibilityStatus(data: any) {
  return {
    type: Type.GET_USER_ACCESSIBILTY_STATUS,
    payload: data,
  };
}

//profile actions
export function getUserprofile() {
  return {
    type: Type.GET_USER_PROFILE,
  };
}

export function getUserprofileSuccess(data: any) {
  return {
    type: Type.GET_USER_PROFILE_SUCCESS,
    payload: data,
  };
}

export function getUserprofileFailure(error: any) {
  return {
    type: Type.GET_USER_PROFILE_FAILURE,
    error: error,
  };
}

// recent order actions

export function getUserRecentOrders() {
  return {
    type: Type.GET_USER_RECENT_ORDERS,
  };
}

export function getUserRecentOrdersSuccess(data: ResponseRecentOrders) {
  return {
    type: Type.GET_USER_RECENT_ORDERS_SUCCESS,
    payload: data,
  };
}

export function getUserRecentOrdersFailure(error: any) {
  return {
    type: Type.GET_USER_RECENT_ORDERS_FAILURE,
    error: error,
  };
}

// favorite order actions

export function getUserFavouriteOrders() {
  return {
    type: Type.GET_USER_FAVORITE_ORDERS,
  };
}

export function getUserFavouriteOrdersSuccess(data: ResponseUserFaves) {
  return {
    type: Type.GET_USER_FAVORITE_ORDERS_SUCCESS,
    payload: data,
  };
}

export function getUserFavouriteOrdersFailure(error: any) {
  return {
    type: Type.GET_USER_FAVORITE_ORDERS_FAILURE,
    error: error,
  };
}

// delivery address actions

export function getUserDeliveryAddresses() {
  return {
    type: Type.GET_USER_DELIVERY_ADDRESSES,
  };
}

export function getUserDeliveryAddressesSuccess(data: ResponseUserDeliveryAddresses) {
  return {
    type: Type.GET_USER_DELIVERY_ADDRESSES_SUCCESS,
    payload: data,
  };
}

export function getUserDeliveryAddressesFailure(error: any) {
  return {
    type: Type.GET_USER_DELIVERY_ADDRESSES_FAILURE,
    error: error,
  };
}

//set User default delivery address , Setting only , No retrieval

export function setUserDefaultDelAddress(data: RequestUserDefaultAddress, callBack: any) {
  return {
    type: Type.SET_USER_DEFAULT_DELIVERY_ADDRESS,
    payload: data,
    callBack,
  };
}
export function setUserDefaultDelAddressSuccess(data: ResponseUserDeliveryAddresses) {
  return {
    type: Type.SET_USER_DEF_DEL_ADD_SUCCESS,
    payload: data,
  };
}

export function setUserDefaultDelAddFailure(error: any) {
  return {
    type: Type.SET_USER_DEFAULT_DEL_ADD_FAILURE,
    error: error,
  };
}

//Delete user delivery address

export function deleteUserDeliveryAddress(addressId: number, callBack: any) {
  return {
    type: Type.DELETE_USER_DELIVERY_ADDRESS,
    addressid: addressId,
    callBack,
  };
}

export function deleteUserDelAddSuccess() {
  return {
    type: Type.DEL_USER_DEL_ADD_SUCCESS,
  };
}

export function deleteUserDelAddFailure(error: any) {
  return {
    type: Type.DEL_USER_DEL_ADD_FAILURE,
    error: error,
  };
}

//Update user
export function updateUser(data: any, profileCheck: boolean, callBack: any) {
  return {
    type: Type.UPDATE_USER,
    payload: data,
    profileCheck: profileCheck,
    callBack,
  };
}

export function updateUserSuccess(data: any) {
  return {
    type: Type.UPDATE_USER_SUCCESS,
    payload: data,
  };
}

export function updateUserFailure(error: any, profileCheck: boolean) {
  if (profileCheck) {
    displayToast(
      'ERROR',
      (error && error.current_password && error.current_password[0]) ||
        (error && error.phone && error.phone[0]) ||
        (error && error.email && error.email[0]) ||
        (error && error.password && error.password[0]) ||
        (error && error.data[0]) ||
        (error && 'Profile not updated'),
    );
  }
  return {
    type: Type.UPDATE_USER_FAILURE,
    error: error,
  };
}

export function updateProfileSuccess(data: any) {
  return {
    type: Type.UPDATE_PROFILE_SUCCESS,
    payload: data,
  };
}

export function changePasswordSuccess(data: any) {
  return {
    type: Type.CHANGE_PASSWORD_SUCCESS,
    payload: data,
  };
}
export function changePasswordFailure(error: any) {
  return {
    type: Type.CHANGE_PASSWORD_FAILURE,
    payload: error,
  };
}

//  Get Billing Accounts

export function getAllBillingAccounts() {
  return {
    type: Type.GET_BILLING_ACCOUNTS,
  };
}

export function getAllBillingAccountsSuccess(data: ResponseUserBillingAccounts) {
  return {
    type: Type.GET_BILLING_ACCOUNTS_SUCCESS,
    payload: data,
  };
}

export function getAllBillingAccountsFailure(error: any) {
  return {
    type: Type.GET_BILLING_ACCOUNTS_FAILURE,
    error: error,
  };
}

export function getBillingAccountByIdSuccess(data: ResponseUserBillingAccounts) {
  return {
    type: Type.GET_BILLING_ACCOUNT_BY_ID_SUCCESS,
    payload: data,
  };
}

export function getBillingAccountByIdFailure(error: any) {
  return {
    type: Type.GET_BILLING_ACCOUNT_BY_ID_FAILURE,
    error: error,
  };
}

// Delete Billing Account

export function deleteBillingAccount(billingAccountId: number, callBack: any) {
  return {
    type: Type.DELETE_BILLING_ACCOUNTS,
    billingAccountId: billingAccountId,
    callback: callBack,
  };
}

export function deleteBillingAccountSuccess() {
  return {
    type: Type.DELETE_BILLING_ACCOUNTS_SUCCESS,
  };
}

export function deleteBillingAccountFailure(error: any) {
  return {
    type: Type.DELETE_BILLING_ACCOUNTS_FAILURE,
    error: error,
  };
}

// update Billing Account

export function updateBillingAccount(
  data: RequestUserDefaultBillingAccount,
  billingAccountId: number,
  callback: any,
) {
  return {
    type: Type.UPDATE_BILLING_ACCOUNTS,
    payload: data,
    billingAccountId: billingAccountId,
    callback,
  };
}

export function updateBillingAccountSuccess(data: ResponseUserBillingAccounts) {
  return {
    type: Type.UPDATE_BILLING_ACCOUNTS_SUCCESS,
    payload: data,
  };
}

export function updateBillingAccountFailure(error: any) {
  return {
    type: Type.UPDATE_BILLING_ACCOUNTS_FAILURE,
    error: error,
  };
}

export function getAllGiftCardsSuccess(data: ResponseUserBillingAccounts) {
  return {
    type: Type.GET_GIFT_CARDS_SUCCESS,
    payload: data,
  };
}

export function getAllGiftCardsFailure(error: any) {
  return {
    type: Type.GET_GIFT_CARDS_FAILURE,
    error: error,
  };
}

//Delete Fav Order
//Delete user delivery address

export function deleteFavOrder(favId: number, callBack: any) {
  return {
    type: Type.DELETE_FAV_ORDER,
    favid: favId,
    callBack,
  };
}

export function deleteFavOrderSuccess() {
  return {
    type: Type.DEL_FAV_ORDER_SUCCESS,
  };
}

export function deleteFavOrderFailure(error: any) {
  return {
    type: Type.DEL_FAV_ORDER__FAILURE,
    error: error,
  };
}

export function updateUserContactOptionsSuccess() {
  return {
    type: Type.UPDATE_USER_CONTACT_OPTIONS_SUCCESS,
  };
}

export function updateUserContactOptionsFailure(error: any) {
  return {
    type: Type.UPDATE_USER_CONTACT_OPTIONS_FAILURE,
    error: error,
  };
}

export function userLogin(
  data: any,
  basketID: string = '',
  isGuest: boolean = false,
  screen: string = '',
) {
  return {
    type: Type.USER_LOGIN_REQUEST,
    data,
    basketID,
    isGuest,
    screen,
  };
}

export function userLoginSuccess(data: any) {
  return {
    type: Type.USER_LOGIN_SUCCESS,
    payload: data,
  };
}

export function userLoginFailure(error: any) {
  if (error?.data?.errors?.base?.length > 0) {
  } else if (
    error?.data?.errors?.device_already_shared[0].includes('with maximum number of guests allowed.')
  ) {
    Alert.alert(
      'Device Limit Reached',
      'You cannot create more accounts on this device. Your device already shared with maximum number of guests allowed.',
    );
    // displayToast('ERROR', 'Device already shared with maximum number of guests allowed.', true);
  } else {
    displayToast(
      'ERROR',
      error?.data?.error ? error.data.error : 'ERROR! Please Try again later',
      true,
    );
  }
  return {
    type: Type.USER_LOGIN_FAILURE,
    error: error,
  };
}

export function clearProviderError() {
  return {
    type: Type.CLEAR_PROVIDER_ERROR,
  };
}
export function userRegister(
  data: any,
  registerType: any,
  basketID: any,
  isGuest: boolean,
  screen: string,
  callback: any
) {
  return {
    type: Type.USER_REGISTER_REQUEST,
    data,
    registerType,
    basketID,
    isGuest,
    screen,
    callback,
  };
}

export function userRegisterSuccess(data: any) {
  return {
    type: Type.USER_REGISTER_SUCCESS,
    payload: data,
  };
}

export function userRegisterFailure(error: any) {
  if (error?.data?.errors?.birthday) {
  }
  else if (error?.data?.errors?.email) {
  }
  else if (error?.data?.errors?.phone) {
  }
  else if (
    error?.data?.errors?.base?.[0]?.includes(
      'You are too young to join this program as per the Terms and Conditions.',
    )
  ) {
  } else if (
    error?.data?.errors?.base &&
    error.data.errors.base.length &&
    !error?.data?.errors?.base?.[0]?.includes('invite code')
  ) {
    // displayToast('ERROR', error?.data?.errors.base[0]);
  } else if (error?.data?.errors?.device_already_shared?.length) {
    Alert.alert(
      'Device Limit Reached',
      'You cannot create more accounts on this device. Your device already shared with maximum number of guests allowed.',
    );
  } else {
    displayToast('ERROR', 'Something went wrong. Please try again later', true);
  }
  return {
    type: Type.USER_REGISTER_FAILURE,
    error: error,
  };
}

export function userRegisterApple(data: any, basketId: string, isGuest: boolean, screen: string) {
  return {
    type: Type.USER_REGISTER_APPLE,
    data,
    basketId,
    isGuest,
    screen,
  };
}

export function userRegisterAppleSuccess(data: any) {
  return {
    type: Type.USER_REGISTER_APPLE_SUCCESS,
    payload: data,
  };
}

export function userRegisterAppleFailure(error: any) {
  // displayToast(
  //   'ERROR',
  //   error?.data?.errors ? error.data.error : 'ERROR! Please Try again later',
  //   true,
  // );
  return {
    type: Type.USER_REGISTER_APPLE_FAILURE,
    error,
  };
}
export function userForgotPasswordRequest(data: any, callBack: any) {
  return {
    type: Type.USER_FORGOT_PASSWORD_REQUEST,
    data,
    callBack,
  };
}

export function userForgotPasswordSuccess() {
  displayToast('SUCCESS', 'we have sent a recovery link to your email');
  return {
    type: Type.USER_FORGOT_PASSWORD_SUCCESS,
  };
}

export function userForgotPasswordFailure(error: any) {
  displayToast(
    'ERROR',
    error?.data?.error ? error.data.error : 'ERROR! Please Try again later',
    true,
  );
  return {
    type: Type.USER_FORGOT_PASSWORD_FAILURE,
    error: error,
  };
}

export function userResetPasswordRequest(data: any, reset_password_token: string | null) {
  return {
    type: Type.USER_RESET_PASSWORD_REQUEST,
    data,
    reset_password_token,
  };
}

export function userResetPasswordSuccess() {
  displayToast('SUCCESS', 'password updated successfully');
  return {
    type: Type.USER_RESET_PASSWORD_SUCCESS,
  };
}

export function userResetPasswordFailure(error: any) {
  if (error?.status === 401) {
    displayToast('ERROR', 'Reset code has been expired!');
  } else if (error?.status === 422) {
    displayToast('ERROR', 'Password need to be new and unused');
  } else {
    displayToast('ERROR', error?.data?.error ? error.data.error : 'ERROR! Please Try again later');
  }
  return {
    type: Type.USER_RESET_PASSWORD_FAILURE,
    error: error,
  };
}

export function userLogout() {
  return {
    type: Type.USER_LOGOUT,
  };
}

export function userLogoutSuccess() {
  return {
    type: Type.USER_LOGOUT_SUCCESS,
  };
}

export function guestUserLogin() {
  return {
    type: Type.GUEST_USER_LOGIN,
  };
}

// @ts-ignore
export const facebookUserLogin = (
  data: any,
  basketId: string = '',
  isGuest: boolean,
  screen: string,
) => ({
  type: Type.USER_FACEBOOK_REQUEST,
  data,
  basketId,
  isGuest,
  screen,
});

export function deleteUserAccount(callback: any) {
  return {
    type: Type.DELETE_USER_ACCOUNT,
    callback,
  };
}

export function deleteUserAccountSuccess(data: any) {
  return {
    type: Type.DELETE_USER_ACCOUNT_SUCCESS,
    payload: data,
  };
}

export function deleteUserAccountFailure(data: any) {
  return {
    type: Type.DELETE_USER_ACCOUNT_FAILURE,
    payload: data,
  };
}
