import React, {memo, useCallback, useEffect, useState} from 'react';
import {Linking} from 'react-native';
import queryString from 'query-string';
import Config from 'react-native-config';
import {screens, constants} from '../constants';
import {navigateTo} from '../utils/navigationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {getResturantListRequest} from '../redux/actions/restaurant/list';
import {guestUserLogin} from '../redux/actions/user';
import {setResturantInfoRequest} from '../redux/actions/restaurant';
import {colors} from '../theme';
import useAuthSelector from '../hooks/reduxStateHooks/useAuthSelector';
import useRestaurantsListSelector from '../hooks/reduxStateHooks/useRestaurantsListSelector';
import {resetBasketRequest} from '../redux/actions/basket';
import {setDeliveryAddressReduxState} from '../redux/actions/location/delivery-address';
import {displayToast} from '../helpers/toast';
import SpinnerOverly from '../components/LoadingComponent/SpinnerOverly';

let firstCallDone = false;
function DeepLinkHandler() {
  const dispatch = useDispatch();
  const {isLoggedIn} = useAuthSelector();
  const {isGuestLogin} = useSelector(state => state.guestLogin);
  const [isLoading, setIsLoading] = useState(false);

  const {restaurantsList} = useRestaurantsListSelector();

  const checkRestaurantHandOffAvailability = (restaurant, handoff) => {
    switch (handoff) {
      case constants.handOffMode.DINEIN:
        return restaurant.supportsdinein;
      case constants.handOffMode.PICKUP:
        return restaurant.canpickup;
      case constants.handOffMode.CURBSIDE:
        return restaurant.supportscurbside;
      case constants.handOffMode.DISPATCH:
        return restaurant.supportsdispatch;
      default:
        return false;
    }
  };

  const resetPasswordHandler = receivedUrl => {
    const {reset_password_token} = queryString.parseUrl(receivedUrl).query || {};

    navigateTo(screens.RESET_PASSWORD, {
      paramKey: reset_password_token,
    });
  };

  const dispatchOrderCallback = (restaurants, restaurantValue, handoff) => {
    const rest = restaurants?.filter(x => {
      return x?.slug?.toLowerCase?.() === restaurantValue?.toLowerCase?.();
    });
    const deliveryAddress = {
      address1: rest?.[0].streetaddress,
      address2: rest?.[0].building,
      city: rest?.[0]?.city,
      state: rest?.[0]?.state,
      zip: rest?.[0].zip,
    };
    if (checkRestaurantHandOffAvailability(rest[0], handoff)) {
      dispatch(setResturantInfoRequest(rest[0], handoff));
      dispatch(setDeliveryAddressReduxState(deliveryAddress));
      navigateTo(screens.MENU_CATEGORIES);
    } else {
      displayToast('ERROR', `Store does not support ${handoff} orders.`);
    }
  };
  const dispatchHandler = useCallback(
    receivedUrl => {
      const {handoff} = queryString.parseUrl(receivedUrl).query || {};
      const url = queryString.parseUrl(receivedUrl).url;
      const restaurantValue = url.split('/')?.[4];
      if (handoff && restaurantValue) {
        if (!isLoggedIn && !isGuestLogin) {
          dispatch(guestUserLogin());
        }
        dispatch(resetBasketRequest());
        setIsLoading(true);
        if (restaurantsList?.restaurants.length) {
          dispatchOrderCallback(restaurantsList?.restaurants, restaurantValue, handoff);
        } else {
          dispatch(
            getResturantListRequest((_, mRestaurants) =>
              dispatchOrderCallback(mRestaurants?.restaurants, restaurantValue, handoff),
            ),
          );
        }
      }
    },
    [isLoggedIn, isGuestLogin, restaurantsList?.restaurants, dispatch],
  );

  const onLinkOpenedApp = useCallback(
    async link => {
      const receivedUrl = link?.url ?? link;
      if (receivedUrl?.includes(Config.REACT_APP_PATH_PREFIX_RESET_PASSWORD)) {
        resetPasswordHandler(receivedUrl);
      } else if (receivedUrl?.includes(Config.REACT_APP_PATH_PREFIX_DINEIN)) {
        dispatchHandler(receivedUrl);
      }
    },
    [dispatchHandler],
  );

  useEffect(() => {
    if (!firstCallDone) {
      Linking.getInitialURL().then(onLinkOpenedApp);
      firstCallDone = true;
    }
    const unsubscribe = Linking.addEventListener('url', onLinkOpenedApp);
    return unsubscribe.remove;
  }, [onLinkOpenedApp]);

  return <SpinnerOverly visible={isLoading} color={colors.primary} />;
}

export default memo(DeepLinkHandler);
