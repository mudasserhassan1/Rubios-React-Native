import React, {useCallback, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';

import {facebookUserLogin} from '../redux/actions/user';
import {logToConsole} from '../configs';
import {images} from '../assets';
import SocialButtonWrapper from '../components/SocialButtonWrapperComponent';
import useBasketSelector from './reduxStateHooks/useBasketSelector';
import useGuestSelector from './reduxStateHooks/useGuestSelector';
import {useRoute} from '@react-navigation/native';
import {showAlert} from '../helpers/toast';

const useFacebookAuth = ({containerStyle, imageStyle, disabled}) => {
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();

  const {basket} = useBasketSelector();
  const {id: basketId} = basket || {};

  const {isGuest} = useGuestSelector();
  const {params} = useRoute();
  const {screenName = 'Home'} = params || {};

  const loginWithFacebook = useCallback(() => {
    setUserInfo({});
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(login => {
        const {isCancelled} = login || {};
        if (!isCancelled) {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data?.accessToken;
            const obj = {
              facebook_access_token: accessToken,
              apn_token: '',
              gcm_token: '',
              signup_channel: 'MobileFacebook',
            };
            dispatch(facebookUserLogin(obj, basketId, isGuest, screenName));
          });
        }
      })
      .catch(error => {
        showAlert({message: 'An unknown error occurred while login. Please try again later'});
        logToConsole({error: error});
      });
  }, [basketId, dispatch, isGuest, screenName]);

  const renderFacebookButtonJSX = useMemo(() => {
    return (
      <SocialButtonWrapper
        imageName={images.facebook}
        onPress={loginWithFacebook}
        containerStyle={containerStyle}
        disabled={!!disabled}
        imageStyle={imageStyle}
        accessibilityLabel={'Facebook Login'}
        accessibilityHint={'activate to login using facebook account'}
      />
    );
  }, [containerStyle, disabled, imageStyle, loginWithFacebook]);

  return {
    renderFacebookButtonJSX,
    userInfo,
  };
};
export default useFacebookAuth;
