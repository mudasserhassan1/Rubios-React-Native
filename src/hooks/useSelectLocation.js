import useRestaurantInfoSelector from './reduxStateHooks/useRestaurantInfoSelector';
import useBasketSelector from './reduxStateHooks/useBasketSelector';
import {basketTransferRequest, basketTransferReset} from '../redux/actions/basket/transfer';
import {constants, screens, strings} from '../constants';
import {useDispatch} from 'react-redux';
import {navigateTo} from '../utils/navigationUtils';
import {setBasketDeliveryAddress, setBasketDeliveryMode} from '../services/basket';
import {setBasketDeliveryAddressSuccess} from '../redux/actions/basket/checkout';
import {displayToast, showAlert} from '../helpers/toast';
import useTransferBasketSelector from './reduxStateHooks/useTransferBasketSelector';
import {useEffect, useState} from 'react';
import {getBasketRequestSuccess, resetBasketRequest} from '../redux/actions/basket';
import {AccessibilityInfo, Alert} from 'react-native';
import {
  setRestaurantInfoOrderType,
  setResturantInfoRequestSuccess,
} from '../redux/actions/restaurant';
import {formatLocationName} from '../utils/sharedUtils';
import {setDeliveryAddressReduxState} from '../redux/actions/location/delivery-address';
import {logFirebaseCustomEvent} from '../utils/logFirebaseCustomeEvents';
import {createTimeWantedPayload} from '../helpers/checkout';
import {setTimeWantedBasket} from '../services/checkout';
import {formatDateTime} from '../utils/timeUtils';
import {DeliveryMode} from "../helpers/enums";

const useSelectLocation = ({
  newLocation,
  selectedAddress,
  onSelectNewLocation,
  onErrorBeforeLocationChanged,
  orderType,
  name = '',
}) => {
  const {restaurant} = useRestaurantInfoSelector();
  const {id: restaurantId = ''} = restaurant || {};
  const {basket} = useBasketSelector();
  const {id: basketId = ''} = basket || {};
  const {transferredBasket, transferredBasketLoading, transferredBasketError, itemsNotTransferred} =
    useTransferBasketSelector();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  //Handling for new basket i.e, when changing location
  useEffect(() => {
    if (!transferredBasketLoading && name) {
      if (transferredBasketError) {
        if (orderType === constants.handOffMode.DISPATCH && selectedAddress) {
          dispatch(setBasketDeliveryAddressSuccess(selectedAddress));
        }
        if (newLocation && orderType) {
          dispatch(resetBasketRequest());
          dispatch(basketTransferReset());
          dispatch(setResturantInfoRequestSuccess(newLocation, orderType || ''));
          logFirebaseCustomEvent(strings.select_location, {
            location_name: newLocation,
          });
          if (name === screens.CART || name === screens.CHECKOUT) {
            navigateTo(screens.MENU_CATEGORIES);
          } else {
            onSelectNewLocation?.(newLocation); //close modal
          }
        }
      } else if (transferredBasket && newLocation) {
        if (itemsNotTransferred?.length > 0) {
          Alert.alert(
            'Sorry, some items aren’t available at your new location',
            'If you switch locations, the following item will be removed:\n' +
              `${[...new Set(itemsNotTransferred)]?.map(
                (pn, pi) =>
                  `${pn}${pi !== [...new Set(itemsNotTransferred)]?.length - 1 ? ', ' : ''}`,
              )}`,
            [
              {
                text: 'Switch Store',
                style: 'default',
                onPress: () => handleConfirmChangeLocation(),
              },
              {
                text: 'Keep Location',
                style: 'default',
                onPress: () => {
                  handleCancelLocationChange();
                  onSelectNewLocation?.(newLocation, true);
                },
              },
            ],
          );
        } else {
          if (basket?.deliverymode === DeliveryMode.dispatch) {
            handleConfirmChangeLocation().then();
          } else {
            Alert.alert(
                'Location Changed to',
                `${formatLocationName(newLocation?.name)}\n${newLocation?.streetaddress}, ${
                    newLocation?.city
                } ${newLocation?.state || newLocation?.stateName || ''} ${newLocation?.zip}`,
                [
                  {
                    text: 'Cancel',
                    style: 'default',
                    onPress: () => {
                      handleCancelLocationChange();
                      onErrorBeforeLocationChanged?.();
                    },
                  },
                  {
                    text: 'Confirm',
                    style: 'default',
                    onPress: () => handleConfirmChangeLocation(),
                  },
                ],
            );
          }
        }
      }
    }
  }, [
    name,
    transferredBasket,
    transferredBasketLoading,
    transferredBasketError,
    itemsNotTransferred,
      orderType,
  ]);

  const announceAndShowToastMessage = (type, message) => {
    // AccessibilityInfo.announceForAccessibility(message);
    displayToast(type, message);
  }

  const handleCancelLocationChange = () => {
    setLoading(false);
    if (transferredBasket) {
      dispatch(basketTransferReset());
    }
  };
  const handleConfirmChangeLocation = async () => {
    let error;
    if (transferredBasket && newLocation) {
      let updateBasketScheduleResponse;
      if (selectedAddress && orderType === constants.handOffMode.DISPATCH) {
        await updateBasketDeliveryAddressAndHandOffMode();
      } else {
        //Workaround to keep basket time schedule in sync after changing location
        if (basket?.timewanted) {
          try {
            const payload = createTimeWantedPayload(basket?.timewanted);
            updateBasketScheduleResponse = await setTimeWantedBasket(
              transferredBasket?.id,
              payload,
            );
            dispatch(getBasketRequestSuccess(updateBasketScheduleResponse));
            dispatch(setResturantInfoRequestSuccess(newLocation, orderType || ''));
            onSelectNewLocation?.(newLocation);
            announceAndShowToastMessage('SUCCESS', 'Store location changed');
          } catch (e) {
            error = e;
            showAlert({
              message: `${
                newLocation?.name || 'Restaurant'
              } cannot prepare your order at ${formatDateTime(
                basket?.timewanted,
                'dddd dd mmm hh:mm A',
                constants.TIME_FORMAT.YYYYMMDD_HH_mm,
              )}. Your order time is set to ASAP.`,
              onPressRight: () => {
                setLoading(false);
                onSelectNewLocation?.(newLocation);
                dispatch(setResturantInfoRequestSuccess(newLocation, orderType));
                announceAndShowToastMessage('SUCCESS', 'Store location changed');
              },
            });
            dispatch(getBasketRequestSuccess(transferredBasket));
          }
        } else {
          dispatch(getBasketRequestSuccess(transferredBasket));
          onSelectNewLocation?.(newLocation);
          announceAndShowToastMessage('SUCCESS', 'Store location changed');
        }
        if (!error) {
          setLoading(false);
          onSelectNewLocation?.(newLocation);
          dispatch(setResturantInfoRequestSuccess(newLocation, orderType));
          announceAndShowToastMessage('SUCCESS', 'Store location changed');
        }
      }
    }
  };

  const onSelectLocation = async () => {
    if (basketId && restaurantId) {
      setLoading(true);
      await handleChangeLocationAndUpdateBasketScenarios();
    } else {
      dispatch(setResturantInfoRequestSuccess(newLocation, orderType));
      if (orderType === constants.handOffMode.DISPATCH) {
        dispatch(setDeliveryAddressReduxState(selectedAddress));
      }
      onSelectNewLocation?.(newLocation);
    }
  };

  const updateBasketDeliveryAddressAndHandOffMode = async () => {
    let updatedAddress = {
      building: selectedAddress?.building || selectedAddress?.address2 || '',
      streetaddress: selectedAddress?.streetaddress || selectedAddress?.address1 || '',
      city: selectedAddress?.city || '',
      zipcode: selectedAddress?.zipcode || selectedAddress?.zip || '',
      isdefault: selectedAddress?.isdefault || false,
    };
    if (selectedAddress.id) {
      updatedAddress.id = selectedAddress.id
    }
    try {
      const response = await setBasketDeliveryAddress(transferredBasket?.id, updatedAddress);
      dispatch(setBasketDeliveryAddressSuccess(response)); //updating basket in redux
      dispatch(setDeliveryAddressReduxState(selectedAddress));
      try {
        const body = {
          deliverymode: orderType,
        };
        const response = await setBasketDeliveryMode(transferredBasket?.id, body);
        dispatch(setBasketDeliveryAddressSuccess(response)); //updating basket in redux
        //Workaround to keep basket time schedule in sync after changing location
        if (basket?.timewanted) {
          try {
            const payload = createTimeWantedPayload(basket?.timewanted);
            const timeScheduleResponse = await setTimeWantedBasket(transferredBasket?.id, payload);
            dispatch(setBasketDeliveryAddressSuccess(timeScheduleResponse)); //updating basket in redux
            dispatch(setResturantInfoRequestSuccess(newLocation, orderType || ''));
            onSelectNewLocation?.(newLocation);
            announceAndShowToastMessage('SUCCESS', 'Store location changed');
          } catch (e) {
            showAlert({
              message: `${
                formatLocationName(newLocation?.name) || 'Restaurant'
              } cannot prepare your order at ${formatDateTime(
                basket?.timewanted,
                'hh:mm A',
                constants.TIME_FORMAT.YYYYMMDD_HH_mm,
              )}. Your order time is set to ASAP.`,
              onPressRight: () => {
                dispatch(setResturantInfoRequestSuccess(newLocation, orderType || ''));
                onSelectNewLocation?.(newLocation);
                announceAndShowToastMessage('SUCCESS', 'Store location changed');
              },
            });
          }
        } else {
          dispatch(setResturantInfoRequestSuccess(newLocation, orderType || ''));
          onSelectNewLocation?.(newLocation);
          announceAndShowToastMessage('SUCCESS', 'Store location changed');
        }
      } catch (error) {
        onErrorBeforeLocationChanged?.();
        displayToast(
          'ERROR',
          error?.response?.data?.message || 'ERROR! Please Try again later',
          true,
        );
      }
    } catch (error) {
      onErrorBeforeLocationChanged?.();
      displayToast(
        'ERROR',
        error?.response?.data?.message || 'ERROR! Please Try again later',
        true,
      );
    }
  };

  const updateBasketDeliveryAddress = async id => {
    let updatedAddress = {
      building: selectedAddress?.address2 || '',
      streetaddress: selectedAddress?.address1 || '',
      city: selectedAddress?.city || '',
      zipcode: selectedAddress?.zip || '',
      isdefault: selectedAddress?.isdefault || false,
    };
    if (selectedAddress.id) {
      updatedAddress.id = selectedAddress?.id;
    }
    try {
      const response = await setBasketDeliveryAddress(id, updatedAddress);
      dispatch(setDeliveryAddressReduxState(selectedAddress));
      dispatch(setBasketDeliveryAddressSuccess(response)); //updating basket in redux
      dispatch(setResturantInfoRequestSuccess(newLocation, orderType || ''));
      onSelectNewLocation?.(newLocation);
    } catch (error) {
      onErrorBeforeLocationChanged?.();
      displayToast(
        'ERROR',
        error?.response?.data?.message || 'ERROR! Please Try again later',
        true,
      );
    }
  };

  const updateBasketHandOffMode = async id => {
    try {
      const body = {
        deliverymode: orderType,
      };
      const response = await setBasketDeliveryMode(id, body);
      dispatch(setBasketDeliveryAddressSuccess(response)); //updating basket in redux
      dispatch(setRestaurantInfoOrderType(orderType));
      onSelectNewLocation?.(newLocation);
      announceAndShowToastMessage('SUCCESS', 'Order type updated.');
    } catch (error) {
      onErrorBeforeLocationChanged?.();
      displayToast(
        'ERROR',
        error?.response?.data?.message || 'ERROR! Please Try again later',
        true,
      );
    }
  };

  const handleChangeLocationAndUpdateBasketScenarios = async () => {
    if (restaurantId === newLocation.id) {
      if (orderType === constants.handOffMode.DISPATCH && selectedAddress) {
        // update basket delivery address
        return await updateBasketDeliveryAddress(basketId);
      } else if (basket?.deliverymode !== orderType) {
        //update basked handoff mode
        return await updateBasketHandOffMode(basketId);
      }
      setLoading(false);
      return onSelectNewLocation(newLocation);
    }
    return dispatch(basketTransferRequest(basketId, newLocation.id, basket?.deliverymode));
  };

  return {
    onSelectLocation,
    transferredBasketLoading,
    loading,
  };
};
export default useSelectLocation;
