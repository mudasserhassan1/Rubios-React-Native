export enum userTypes {
  GET_USER_PROFILE = 'GET_USER_PROFILE',
  GET_USER_PROFILE_SUCCESS = 'GET_USER_PROFILE_SUCCESS',
  GET_USER_PROFILE_FAILURE = 'GET_USER_PROFILE_FAILURE',

  GET_USER_RECENT_ORDERS = 'GET_USER_RECENT_ORDERS',
  GET_USER_RECENT_ORDERS_SUCCESS = 'GET_USER_RECENT_ORDERS_SUCCESS',
  GET_USER_RECENT_ORDERS_FAILURE = 'GET_USER_RECENT_ORDERS_FAILURE',

  GET_USER_FAVORITE_ORDERS = 'GET_USER_FAVORITE_ORDERS',
  GET_USER_FAVORITE_ORDERS_SUCCESS = 'GET_USER_FAVORITE_ORDERS_SUCCESS',
  GET_USER_FAVORITE_ORDERS_FAILURE = 'GET_USER_FAVORITE_ORDERS_FAILURE',

  GET_USER_DELIVERY_ADDRESSES = 'GET_USER_DELIVERY_ADDRESSES',
  GET_USER_DELIVERY_ADDRESSES_SUCCESS = 'GET_USER_DELIVERY_ADDRESSES_SUCCESS',
  GET_USER_DELIVERY_ADDRESSES_FAILURE = 'GET_USER_DELIVERY_ADDRESSES_FAILURE',

  SET_USER_DEFAULT_DELIVERY_ADDRESS = 'SET_USER_DEFAULT_DELIVERY_ADDRESS',
  SET_USER_DEFAULT_DEL_ADD_FAILURE = 'SET_USER_DEFAULT_DEL_ADD_FAILURE',
  SET_USER_DEF_DEL_ADD_SUCCESS = 'SET_USER_DEF_DEL_ADD_SUCCESS',

  DELETE_USER_DELIVERY_ADDRESS = 'DELETE_USER_DELIVERY_ADDRESS',
  DEL_USER_DEL_ADD_SUCCESS = 'DEL_USER_DEL_ADD_SUCCESS',
  DEL_USER_DEL_ADD_FAILURE = 'DEL_USER_DEL_ADD_FAILURE',

  UPDATE_USER = 'UPDATE_USER',
  UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE',
  UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS',

  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE',

  GET_BILLING_ACCOUNTS = 'GET_BILLING_ACCOUNTS',
  GET_BILLING_ACCOUNTS_SUCCESS = 'GET_BILLING_ACCOUNTS_SUCCESS',
  GET_BILLING_ACCOUNTS_FAILURE = 'GET_BILLING_ACCOUNTS_FAILURE',

  GET_BILLING_ACCOUNT_BY_ID = 'GET_BILLING_ACCOUNT_BY_ID',
  GET_BILLING_ACCOUNT_BY_ID_SUCCESS = 'GET_BILLING_ACCOUNT_BY_ID_SUCCESS',
  GET_BILLING_ACCOUNT_BY_ID_FAILURE = 'GET_BILLING_ACCOUNT_BY_ID_FAILURE',

  DELETE_BILLING_ACCOUNTS = 'DELETE_BILLING_ACCOUNTS',
  DELETE_BILLING_ACCOUNTS_SUCCESS = 'DELETE_BILLING_ACCOUNTS_SUCCESS',
  DELETE_BILLING_ACCOUNTS_FAILURE = 'DELETE_BILLING_ACCOUNTS_FAILURE',

  UPDATE_BILLING_ACCOUNTS = 'UPDATE_BILLING_ACCOUNTS',
  UPDATE_BILLING_ACCOUNTS_SUCCESS = 'UPPDATE_BILLING_ACCOUNTS_SUCCESS',
  UPDATE_BILLING_ACCOUNTS_FAILURE = 'UPDATE_BILLING_ACCOUNTS_FAILURE',

  GET_GIFT_CARDS = 'GET_GIFT_CARDS',
  GET_GIFT_CARDS_SUCCESS = 'GET_GIFT_CARDS_SUCCESS',
  GET_GIFT_CARDS_FAILURE = 'GET_GIFT_CARDS_FAILURE',

  DELETE_FAV_ORDER = 'DELETE_FAV_ORDER',
  DEL_FAV_ORDER_SUCCESS = 'DEL_FAV_ORDER_SUCCESS',
  DEL_FAV_ORDER__FAILURE = 'DEL_FAV_ORDER__FAILURE',

  UPDATE_USER_CONTACT_OPTIONS = 'UPDATE_USER_CONTACT_OPTIONS',
  UPDATE_USER_CONTACT_OPTIONS_SUCCESS = 'UPDATE_USER_CONTACT_OPTIONS_SUCCESS',
  UPDATE_USER_CONTACT_OPTIONS_FAILURE = 'UPDATE_USER_CONTACT_OPTIONS_FAILURE',

  USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE',

  USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST',
  USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS',
  USER_REGISTER_FAILURE = 'USER_REGISTER_FAILURE',

  USER_REGISTER_APPLE = 'USER_REGISTER_APPLE',
  USER_REGISTER_APPLE_SUCCESS = 'USER_REGISTER_APPLE_SUCCESS',
  USER_REGISTER_APPLE_FAILURE = 'USER_REGISTER_APPLE_FAILURE',

  USER_FORGOT_PASSWORD_REQUEST = 'USER_FORGOT_PASSWORD_REQUEST',
  USER_FORGOT_PASSWORD_SUCCESS = 'USER_FORGOT_PASSWORD_SUCCESS',
  USER_FORGOT_PASSWORD_FAILURE = 'USER_FORGOT_PASSWORD_FAILURE',

  USER_RESET_PASSWORD_REQUEST = 'USER_RESET_PASSWORD_REQUEST',
  USER_RESET_PASSWORD_SUCCESS = 'USER_RESET_PASSWORD_SUCCESS',
  USER_RESET_PASSWORD_FAILURE = 'USER_RESET_PASSWORD_FAILURE',

  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USER_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE',
  GUEST_USER_LOGIN = 'GUEST_USER_LOGIN',
  USER_LOGIN = 'USER_LOGIN',
  USER_FACEBOOK_REQUEST = 'USER_FACEBOOK_REQUEST',

  DELETE_USER_ACCOUNT = 'DELETE_USER_ACCOUNT',
  DELETE_USER_ACCOUNT_SUCCESS = 'DELETE_USER_ACCOUNT_SUCCESS',
  DELETE_USER_ACCOUNT_FAILURE = 'DELETE_USER_ACCOUNT_FAILURE',

  CLEAR_PROVIDER_ERROR = 'CLEAR_PROVIDER_ERROR',

  GET_USER_ACCESSIBILTY_STATUS = 'GET_USER_ACCESSIBILITY_STATUS',
}
