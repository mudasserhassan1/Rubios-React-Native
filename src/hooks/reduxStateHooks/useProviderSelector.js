import {useSelector} from 'react-redux';

const useProviderSelector = () => {
  const {
    providerToken = {},
    loading,
    error,
  } = useSelector(state => state?.provider);
  const {user = {}, accessToken = {}} = providerToken || {};
  return {
    providerToken,
    user,
    accessToken,
    loading,
    error,
  };
};

export default useProviderSelector;
