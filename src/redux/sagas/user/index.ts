import {takeEvery, put, call} from 'redux-saga/effects';
import {userTypes as Type} from '../../types/user';
import {authActionsTypes} from '../../types/auth';
import {
  RequestUserProfile,
  requestUserRecentOrders,
  requestUserDeliiveryAddresses,
  requestSetUserDefDelAddress,
  requestDelUserDelAddress,
  requestUpdateUser,
  requestChangePassword,
  requestUserBillingAccount,
  deleteUserBillingAccount,
  requestUserBillingAccountById,
  updateUserBillingAccount,
  requestUseGiftCards,
  requestDeleteFavOrder,
  requestUserFavoriteOrders,
  updateUserContactOptions,
  requestUserLogin,
  requestUserRegister,
  requestUpdateProfile,
  requestUserForgotPassword,
  resetPasswordRequest,
  requestFacebookUserLogin,
  requestDeleteUser,
  deleteUserFromOlo,
  requestAppleSignup,
  userLogoutApi,
} from '../../../services/user';
import {
  deleteUserDelAddFailure,
  getUserDeliveryAddressesFailure,
  getUserDeliveryAddressesSuccess,
  getUserFavouriteOrdersFailure,
  getUserprofileFailure,
  getUserprofileSuccess,
  getUserRecentOrdersFailure,
  getUserRecentOrdersSuccess,
  setUserDefaultDelAddFailure,
  setUserDefaultDelAddressSuccess,
  deleteUserDelAddSuccess,
  updateUserSuccess,
  updateUserFailure,
  changePasswordSuccess,
  changePasswordFailure,
  getAllBillingAccountsSuccess,
  getAllBillingAccountsFailure,
  deleteBillingAccountSuccess,
  deleteBillingAccountFailure,
  updateBillingAccountSuccess,
  updateBillingAccountFailure,
  getBillingAccountByIdSuccess,
  getBillingAccountByIdFailure,
  getAllGiftCardsSuccess,
  getAllGiftCardsFailure,
  deleteFavOrderSuccess,
  deleteFavOrderFailure,
  updateUserContactOptionsSuccess,
  updateUserContactOptionsFailure,
  userLoginSuccess,
  userLoginFailure,
  userRegisterSuccess,
  userRegisterFailure,
  updateProfileSuccess,
  userForgotPasswordSuccess,
  userForgotPasswordFailure,
  userResetPasswordSuccess,
  userResetPasswordFailure,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
  getUserFavouriteOrdersSuccess,
  userRegisterAppleSuccess,
  userRegisterAppleFailure,
  userLogout,
  userLogoutSuccess,
} from '../../actions/user';
import {displayToast} from '../../../helpers/toast';
import {getProviderRequestSuccess} from '../../actions/provider';
import {markOrderFav} from '../../../helpers/setRecentOrders';
import {navigateTo} from '../../../utils/navigationUtils';
import {screens, strings} from '../../../constants/';
import {newUserSuccess} from '../../actions/newUser';
import {store} from '../../store';
import {logToConsole} from '../../../configs';
import {updateUseronOurDB} from '../../../services/otp';
import {logFirebaseCustomEvent} from '../../../utils/logFirebaseCustomeEvents';
import {Alert} from 'react-native';

//profile
function* userProfileHandler(): any {
  try {
    const updatedUser = yield call(RequestUserProfile);
    yield put(getUserprofileSuccess(updatedUser));
    const existingProviderValue: any = store.getState().provider.providerToken;
    const mappedProviderResponse: any = {
      ...existingProviderValue,
      user: {...existingProviderValue.user, updatedUser},
    };
    yield put(getProviderRequestSuccess(mappedProviderResponse));
  } catch (error) {
    yield put(getUserprofileFailure(error));
  }
}
//recent orders
function* userRecentOrdersHandler(): any {
  try {
    const response = yield call(requestUserRecentOrders);
    yield put(getUserRecentOrdersSuccess(response));
  } catch (error) {
    yield put(getUserRecentOrdersFailure(error));
  }
}

////favorite orders
function* userFavoriteOrdersHandler(): any {
  try {
    const response = yield call(requestUserFavoriteOrders);
    yield put(getUserFavouriteOrdersSuccess(response));
  } catch (error) {
    yield put(getUserFavouriteOrdersFailure(error));
  }
}

function* deleteFavOrderHandler(action: any): any {
  const {callBack} = action || {};
  try {
    yield call(requestDeleteFavOrder, action.favid);
    const favOrders = yield call(requestUserFavoriteOrders);
    yield put(getUserFavouriteOrdersSuccess(favOrders));
    yield put(deleteFavOrderSuccess());
    yield markOrderFav('', action.favid, false);
    callBack?.('success');
  } catch (error) {
    callBack?.('Fail');
    yield put(deleteFavOrderFailure(error));
  }
}

//delivery address
function* userDeliveryAddressesHandler(): any {
  try {
    const response = yield call(requestUserDeliiveryAddresses);
    yield put(getUserDeliveryAddressesSuccess(response));
  } catch (error) {
    yield put(getUserDeliveryAddressesFailure(error));
  }
}

//// set user default delivery address
function* userDefaultDelAddressHandler(action: any): any {
  const {callBack} = action || {};
  try {
    const response = yield call(requestSetUserDefDelAddress, action.payload);
    yield put(setUserDefaultDelAddressSuccess(response));
    callBack?.('success');
  } catch (error) {
    yield put(setUserDefaultDelAddFailure(error));
    callBack?.('fail');
  }
}

// delete delivery address
function* deleteDelAddressHandler(action: any): any {
  const {callBack} = action || {};
  try {
    yield call(requestDelUserDelAddress, action.addressid);
    yield put(deleteUserDelAddSuccess());
    callBack?.('success');
  } catch (error) {
    yield put(deleteUserDelAddFailure(error));
    callBack?.('fail');
  }
}

// Update User
function* updateUserHandler(action: any): any {
  try {
    const existingProviderValue: any = store.getState().provider.providerToken;
    if (action.profileCheck) {
      const response = yield call(requestUpdateProfile, action.payload);
      yield put(updateProfileSuccess(response));
      const mappedProviderResponse: any = {
        ...existingProviderValue,
        user: {
          ...existingProviderValue.user,
          facebook_signup: false,
          apple_signup: false,
          response,
        },
      };
      yield put(getProviderRequestSuccess(mappedProviderResponse));
      displayToast('SUCCESS', 'Profile updated successfully');
      action.callBack?.('success');
    } else {
      const response = yield call(requestUpdateUser, action.payload);
      yield put(updateUserSuccess(response));
      const mappedProviderResponse: any = {
        ...existingProviderValue,
        user: {
          ...existingProviderValue.user,
          facebook_signup: false,
          apple_signup: false,
          response,
        },
      };
      yield put(getProviderRequestSuccess(mappedProviderResponse));
      action?.callBack?.('failure');
    }
  } catch (error) {
    yield put(updateUserFailure(error, action.profileCheck));
  }
}

// Update User
function* changePasswordHandler(action: any): any {
  try {
    const response = yield call(requestChangePassword, action.payload);
    yield put(changePasswordSuccess(response));
    displayToast('SUCCESS', 'password updated successfully');
  } catch (error) {
    yield put(changePasswordFailure(error));
    displayToast('ERROR', 'Password need to be new and unused');
  }
}

// Reset Password User
function* userResetPasswordHandler(action: any): any {
  try {
    yield call(resetPasswordRequest, action.data, action.reset_password_token);
    yield put(userResetPasswordSuccess());
    navigateTo(screens.SIGN_IN);
  } catch (error) {
    yield put(userResetPasswordFailure(error));
  }
}

// Get User BillingAccount Info
function* getUserBillingAccountHandler(): any {
  try {
    const response = yield call(requestUserBillingAccount);
    yield put(getAllBillingAccountsSuccess(response));
  } catch (error) {
    yield put(getAllBillingAccountsFailure(error));
  }
}

// Delete User BillingAccount
function* deleteUserBillingAccountHandler(action: any): any {
  try {
    yield call(deleteUserBillingAccount, action.billingAccountId);
    yield put(deleteBillingAccountSuccess());
    yield put({type: Type.GET_BILLING_ACCOUNTS});
    action?.callback?.();
  } catch (error) {
    yield put(deleteBillingAccountFailure(error));
    action?.callback?.();
  }
}

// Get User BillingAccount Info by id
function* getBillingAccountByIdHandler(action: any): any {
  try {
    const response = yield call(requestUserBillingAccountById, action.billingAccountId);
    yield put(getBillingAccountByIdSuccess(response));
  } catch (error) {
    yield put(getBillingAccountByIdFailure(error));
  }
}

// Update User BillingAccount Info
function* updateUserBillingAccountHandler(action: any): any {
  try {
    const response = yield call(updateUserBillingAccount, action.payload, action.billingAccountId);
    yield put(updateBillingAccountSuccess(response));
    if (action.payload.isdefault) {
      displayToast('SUCCESS', 'Default card updated.');
    }
    yield put({type: Type.GET_BILLING_ACCOUNTS});
    action?.callback?.();
  } catch (error) {
    yield put(updateBillingAccountFailure(error));
    action?.callback?.();
  }
}

// Get User GiftCards Info
function* getUserGiftCardsHandler(): any {
  try {
    const response = yield call(requestUseGiftCards);
    yield put(getAllGiftCardsSuccess(response));
  } catch (error) {
    yield put(getAllGiftCardsFailure(error));
  }
}

// Update user contact options
function* updateUserContactOptionsHandler(action: any): any {
  const {callBack} = action || {};
  try {
    yield call(updateUserContactOptions, action.data);
    yield put(updateUserContactOptionsSuccess());
    callBack?.('success');
  } catch (error) {
    yield put(updateUserContactOptionsFailure(error));
    callBack?.('failure');
  }
}

// User Login
function* userLoginHandler(action: any): any {
  try {
    const response = yield call(requestUserLogin, action.data);
    yield put(userLoginSuccess(response));
    yield put({
      type: authActionsTypes.GET_AUTHTOKEN_REQUEST,
      successMsg: 'Login Success',
      basketID: action.basketID,
      data: action.data,
      isGuest: action.isGuest,
      screen: action.screen,
    });
    logFirebaseCustomEvent(strings.screen_name_filter, {
      login: 'login',
    });
  } catch (error) {
    yield put(userLoginFailure(error));
  }
}

// User Register
function* userRegisterHandler(action: any): any {
  try {
    const response = yield call(requestUserRegister, action.data);
    yield put(userRegisterSuccess(response));
    yield put(newUserSuccess(true));
    const {email, phone} = action.data || {};
    const formattedPhone = `+1${phone.replace(/\D/g, '')}`;
    //@ts-ignore
    updateUseronOurDB(formattedPhone, email).then();
    yield put({
      type: authActionsTypes.GET_AUTHTOKEN_REQUEST,
      successMsg: 'Signup Success',
      registerType: action.registerType,
      basketID: action.basketID,
      data: action.data,
      isGuest: action.isGuest,
      screen: action.screen,
      callback: action.callback,
    });
    logFirebaseCustomEvent(strings.screen_name_filter, {
      sign_up: 'sign_up',
    });
  } catch (error) {
    action?.callback?.();
    yield put(userRegisterFailure(error));
  }
}

function* userAppleRegisterHandler(action: any): any {
  try {
    const response = yield call(requestAppleSignup, action.data);
    yield put(userRegisterAppleSuccess(response));
    yield put(newUserSuccess(true));
    yield put({
      type: authActionsTypes.GET_AUTHTOKEN_REQUEST,
      successMsg: 'Signup Success',
      registerType: action.registerType,
      basketID: action.basketId,
      isGuest: action.isGuest,
      screen: action.screen,
      isSocialLogin: true,
    });
  } catch (error) {
    yield put(userRegisterAppleFailure(error));
    yield put(userRegisterFailure(error));
  }
}

function* facebookUserHandler(action: any): any {
  try {
    const response = yield call(requestFacebookUserLogin, action.data);
    yield put(userLoginSuccess(response));
    yield put({
      type: authActionsTypes.GET_AUTHTOKEN_REQUEST,
      successMsg: 'Login Success',
      basketID: action.basketId,
      isSocialLogin: true,
      isGuest: action.isGuest,
      screen: action.screen,
    });
  } catch (error: any) {
    yield put(userRegisterFailure(error));
    yield put(userLoginFailure(error));
  }
}

// User Register
function* userForgotPasswordHandler(action: any): any {
  const {callBack} = action || {};
  try {
    yield call(requestUserForgotPassword, action.data);
    yield put(userForgotPasswordSuccess());
    callBack?.('success');
    // navigateTo(screens.CHECK_YOUR_MAIL, {email: action.data.email});
  } catch (error) {
    callBack?.('failure');
    yield put(userForgotPasswordFailure(error));
    action?.callback?.();
  }
}

function* deleteUserHandler(action: any): any {
  try {
    const response = yield call(requestDeleteUser);
    yield call(deleteUserFromOlo);
    yield put(deleteUserAccountSuccess(response));
    Alert.alert('Account Deletion', response.message?.replace(/Guest/g, 'Your account is'));
    action.callback?.();
  } catch (error: any) {
    logToConsole({error: error?.message});
    yield put(deleteUserAccountFailure(error));
    action.callback?.();
  }
}

function* asyncUserLogout(): any {
  try {
    yield call(userLogoutApi);
    yield put(userLogoutSuccess());
  } catch (e: any) {
    yield put(userLogoutSuccess());
  }
}
export function* userSaga() {
  yield takeEvery(Type.GET_USER_PROFILE, userProfileHandler);
  yield takeEvery(Type.GET_USER_RECENT_ORDERS, userRecentOrdersHandler);
  yield takeEvery(Type.GET_USER_FAVORITE_ORDERS, userFavoriteOrdersHandler);
  yield takeEvery(Type.GET_USER_DELIVERY_ADDRESSES, userDeliveryAddressesHandler);
  yield takeEvery(Type.SET_USER_DEFAULT_DELIVERY_ADDRESS, userDefaultDelAddressHandler);
  yield takeEvery(Type.DELETE_USER_DELIVERY_ADDRESS, deleteDelAddressHandler);
  yield takeEvery(Type.UPDATE_USER, updateUserHandler);
  yield takeEvery(Type.CHANGE_PASSWORD, changePasswordHandler);
  yield takeEvery(Type.GET_BILLING_ACCOUNTS, getUserBillingAccountHandler);
  yield takeEvery(Type.GET_BILLING_ACCOUNT_BY_ID, getBillingAccountByIdHandler);
  yield takeEvery(Type.DELETE_BILLING_ACCOUNTS, deleteUserBillingAccountHandler);
  yield takeEvery(Type.UPDATE_BILLING_ACCOUNTS, updateUserBillingAccountHandler);
  yield takeEvery(Type.GET_GIFT_CARDS, getUserGiftCardsHandler);
  yield takeEvery(Type.DELETE_FAV_ORDER, deleteFavOrderHandler);
  yield takeEvery(Type.UPDATE_USER_CONTACT_OPTIONS, updateUserContactOptionsHandler);
  yield takeEvery(Type.USER_LOGIN_REQUEST, userLoginHandler);
  yield takeEvery(Type.USER_REGISTER_REQUEST, userRegisterHandler);
  yield takeEvery(Type.USER_REGISTER_APPLE, userAppleRegisterHandler);
  yield takeEvery(Type.USER_FACEBOOK_REQUEST, facebookUserHandler);
  yield takeEvery(Type.USER_FORGOT_PASSWORD_REQUEST, userForgotPasswordHandler);
  yield takeEvery(Type.USER_RESET_PASSWORD_REQUEST, userResetPasswordHandler);
  yield takeEvery(Type.USER_LOGOUT, asyncUserLogout);
  yield takeEvery(Type.DELETE_USER_ACCOUNT, deleteUserHandler);
}
