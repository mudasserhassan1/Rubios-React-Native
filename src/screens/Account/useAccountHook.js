import {constants, screens} from '../../constants';
import {useDispatch} from 'react-redux';
import {deleteUserAccount, userLogout} from '../../redux/actions/user';
import {useNavigation} from '@react-navigation/native';

const useAccountHook = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accountTitles = constants.ACCOUNT_TITLES;
  const accountTilesList = [
    {title: accountTitles.MY_REWARDS},
    {title: accountTitles.CHECK_IN},
    {title: accountTitles.ORDERS},
    {title: accountTitles.PAYMENT_METHODS},
    {title: accountTitles.DELIVERY_ADDRESSES},
    {title: accountTitles.ACCOUNT_HISTORY},
    {title: accountTitles.INVITE_FRIENDS},
    {title: accountTitles.PROFILE},
    {title: accountTitles.CHALLENGES},
    {title: accountTitles.CHALLENGE_DETAIL},
    {title: accountTitles.LOGOUT},
    {title: accountTitles.DELETE_ACCOUNT},
  ];

  const handleRedirections = title => {
    switch (title) {
      case accountTitles.MY_REWARDS:
        navigation.navigate(screens.REWARDS);
        break;
      case accountTitles.CHECK_IN:
        navigation.navigate(screens.CHECK_IN);
        break;
      case accountTitles.ORDERS:
        navigation.navigate(screens.MY_ORDERS);
        break;
      case accountTitles.LOGOUT:
        dispatch(userLogout());
        break;
      case accountTitles.DELETE_ACCOUNT:
        dispatch(deleteUserAccount());
        break;
      case accountTitles.DELIVERY_ADDRESSES:
        navigation.navigate(screens.DELIVERY_ADDRESSES);
        break;
      case accountTitles.PAYMENT_METHODS:
        navigation.navigate(screens.PAYMENT_METHODS);
        break;
      case accountTitles.PROFILE:
        navigation.navigate(screens.PROFILE);
        break;
      case accountTitles.ACCOUNT_HISTORY:
        navigation.navigate(screens.ACCOUNT_HISTORY);
        break;
      case accountTitles.INVITE_FRIENDS:
        navigation.navigate(screens.INVITE_FRIENDS);
        break;
      case accountTitles.CHALLENGES:
        navigation.navigate(screens.CHALLENGES);
        break;
      case accountTitles.CHALLENGE_DETAIL:
        navigation.navigate(screens.CHALLENGE_DETAIL);
        break;
    }
  };
  return {
    accountTitles,
    accountTilesList,
    handleRedirections,
  };
};

export default useAccountHook;
