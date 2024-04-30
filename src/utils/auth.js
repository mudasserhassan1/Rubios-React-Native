import {store} from '../redux/store';

export function isLoginUser() {
  const {authToken} = store?.getState()?.auth?.authToken;
  const {providerToken} = store?.getState()?.provider?.providerToken;
  return !!(authToken && providerToken);
}
