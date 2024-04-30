import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setResturantInfoRequestSuccess} from '../redux/actions/restaurant';
import {constants, screens, strings} from '../constants';
import {
  createBasketFromFavOrderRequest,
  createBasketFromPrevOrderRequest,
} from '../redux/actions/basket/create';
import {navigateTo} from '../utils/navigationUtils';
import SpinnerOverly from '../components/LoadingComponent/SpinnerOverly';
import useRestaurantsListSelector from './reduxStateHooks/useRestaurantsListSelector';
import {
  setDeliveryAddressReduxState,
  setDeliveryAddressSuccess,
} from '../redux/actions/location/delivery-address';
import {getRestaurantInfo} from '../services/restaurant';
import {logFirebaseCustomEvent} from '../utils/logFirebaseCustomeEvents';
import {setBasketDeliveryAddress, setBasketDeliveryMode} from '../services/basket';
import {setBasketDeliveryAddressSuccess} from '../redux/actions/basket/checkout';
import {displayToast} from '../helpers/toast';
import {logToConsole} from '../configs';

const useReorderHook = () => {
  const {loading: createBasketLoading} = useSelector(state => state.createBasket);
  const {restaurantsList} = useRestaurantsListSelector();
  const [favLoading, setFavLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!createBasketLoading) {
      setFavLoading(false);
      setReorderLoading(false);
    }
  }, [createBasketLoading]);

  const updateBasketDeliveryAddressAndHandOffMode = async (basket, address) => {
    const addressToSaveInRedux = {
      address1: address?.streetaddress,
      address2: address?.building,
      city: address?.city,
      zip: address?.zipcode,
      state: address?.state || '',
    };
    if (address?.id) {
      addressToSaveInRedux.id = address;
    }
    try {
      const response = await setBasketDeliveryAddress(basket?.id, address);
      dispatch(setBasketDeliveryAddressSuccess(response)); //updating basket in redux
      dispatch(setDeliveryAddressReduxState(addressToSaveInRedux));
      try {
        const body = {
          deliverymode: 'dispatch',
        };
        const basketDeliveryModeResponse = await setBasketDeliveryMode(basket?.id, body);
        dispatch(setBasketDeliveryAddressSuccess(basketDeliveryModeResponse)); //updating basket in redux
        setReorderLoading(false);
        logFirebaseCustomEvent(strings.click, {
          click_label: 'reorder',
          click_destination: screens.CART,
        });
        navigateTo(screens.CART);
      } catch (error) {
        setReorderLoading(false);
        displayToast(
          'ERROR',
          error?.response?.data?.message || 'ERROR! Please Try again later',
          true,
        );
      }
    } catch (error) {
      setReorderLoading(false);
      displayToast(
        'ERROR',
        error?.response?.data?.message || 'ERROR! Please Try again later',
        true,
      );
    }
  };

  const reorderCallback = async (basket, order) => {
    try {
      const restaurant = restaurantsList?.restaurants.find(r => r.id === order.vendorid);
      const orderType = order.deliverymode;
      const deliveryAddress = order.deliveryaddress || {};
      if (restaurant) {
        dispatch(setResturantInfoRequestSuccess(restaurant || {}, orderType));
      }
      if (orderType === constants.handOffMode.DISPATCH) {
        await updateBasketDeliveryAddressAndHandOffMode(basket, deliveryAddress);
      } else {
        setReorderLoading(false);
        logFirebaseCustomEvent(strings.click, {
          click_label: 'reorder',
          click_destination: screens.CART,
        });
        navigateTo(screens.CART);
      }
    } catch (e) {
      setReorderLoading(false);
      logToConsole({reorderCallback: e.message});
    }
  };

  const onReorder = (requestBody, order) => {
    const isEligibleCallback = order.products.length > 1;
    setReorderLoading(true);
    dispatch(
      createBasketFromPrevOrderRequest(requestBody,isEligibleCallback, basket => reorderCallback(basket, order), body => onReorderFailureCallback(body, order)),
    );
  };

  const onReorderFailureCallback = async (body, order) => {
    body.ignoreunavailableproducts = true;
    onReorder(body, order);
  }

  const onFavouriteReorder = async (requestBody, isEligibleCallback) => {
    setFavLoading(true);
    const favReorderCallback = (restaurant, deliverymode) => {
      if (restaurant) {
        dispatch(setResturantInfoRequestSuccess(restaurant, deliverymode));
      }
      logFirebaseCustomEvent(strings.click, {
        click_label: 'reorder',
        click_destination: screens.CART,
      });
      navigateTo(screens.CART);
    };
    const {vendorid = '', ...rest} = requestBody || {};
    const response = await getRestaurantInfo(vendorid);
    dispatch(
      createBasketFromFavOrderRequest(rest, isEligibleCallback, deliverymode =>
        favReorderCallback(response, deliverymode), () => onFavReorderFailureCallback(requestBody)
      ),
    );
  };

  const onFavReorderFailureCallback = async (body) => {
    body.ignoreunavailableproducts = true;
    await onFavouriteReorder(body);
  }

  const renderLoadingJSX = () => {
    return <SpinnerOverly visible={createBasketLoading} />;
  };
  return {
    onReorder,
    onFavouriteReorder,
    reorderLoading,
    renderLoadingJSX,
    favLoading,
  };
};
export default useReorderHook;
