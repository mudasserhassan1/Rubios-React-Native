import {fireBaseConfigType as Type} from '../../types/firebase-config-values';

export function saveIOSForceUpdate(data: any) {
  return {
    type: Type.SAVE_IOS_FORCE_UPDATE,
    payload: data,
  };
}

export function saveAndroidForceUpdate(data: any) {
  return {
    type: Type.SAVE_ANDROID_FORCE_UPDATE,
    payload: data,
  };
}

export function saveIOSVersionNumber(data: any) {
  return {
    type: Type.SAVE_IOS_VERSION_NUMBER,
    payload: data,
  };
}

export function saveAndroidVersionNumber(data: any) {
  return {
    type: Type.SAVE_ANDROID_VERSION_NUMBER,
    payload: data,
  };
}
export function excludeRestaurants(data: any) {
  return {
    type: Type.EXCLUDE_RESTAURANTS,
    payload: data,
  };
}

export function saveConfig(data: any) {
  return {
    type: Type.SAVE_CONFIG,
    payload: data,
  };
}
