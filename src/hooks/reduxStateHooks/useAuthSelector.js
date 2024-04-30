import {useSelector} from 'react-redux';
import useProviderSelector from './useProviderSelector';

const useAuthSelector = () => {
  const {authToken, loading: authLoading, error: authError} = useSelector(state => state.auth);
  const {providerToken, loading: providerLoading, error: providerError} = useProviderSelector();
  const isLoading = authLoading || providerLoading;
  const isLoggedIn = !!(authToken && providerToken);
  const {user = {}} = providerToken || {};
  const {facebook_signup, apple_signup} = user || {};

  // !favourite_location_ids
  const isSocialSignup = facebook_signup || apple_signup;
  // && isLoggedIn;

  return {
    authToken,
    isLoggedIn,
    authLoading,
    providerLoading,
    providerToken,
    authError,
    providerError,
    isLoading,
    isSocialSignup,
    user,
  };
};
export default useAuthSelector;
