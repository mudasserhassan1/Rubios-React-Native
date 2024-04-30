import {useEffect, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  deleteUserDeliveryAddress,
  getUserDeliveryAddresses, getUserDeliveryAddressesSuccess,
  setUserDefaultDelAddress,
} from '../../redux/actions/user';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../../constants';

const useDeliveryAddressHook = () => {
  const [deliveryaddresses, setDelAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renderOnStart, setRenderOnStart] = useState(false);
  const dispatch = useDispatch();

  const {
    userDeliveryAddresses = [],
    userDefaultDeliveryAddress,
    userDataLoading: deliveryAddressesLoading,
  } = useUserSelector();
  useEffect(() => {
    dispatch(getUserDeliveryAddresses());
    setRenderOnStart(!renderOnStart);
  }, [userDefaultDeliveryAddress]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'delivery_address_screen',
    });
  }, []);

  const isDefaultPresent = useMemo(
    () => deliveryaddresses.some(item => item.isdefault),
    [deliveryaddresses],
  );

  useEffect(() => {
    if (userDeliveryAddresses && userDeliveryAddresses.deliveryaddresses) {
      setDelAddresses(
        userDeliveryAddresses.deliveryaddresses.reduce(
          (pre, curr) => (curr?.isdefault ? [curr, ...pre] : [...pre, curr]),
          [],
        ),
      );
    }
  }, [userDeliveryAddresses]);

  const defaultAddressHandler = id => {
    setLoading(true);
    const obj = {
      addressid: id.id,
    };
    logFirebaseCustomEvent(strings.click, {
      click_label: 'make_default',
      click_destination: screens.DELIVERY_ADDRESSES,
    });
    dispatch(setUserDefaultDelAddress(obj, makeDefaultCallBackStatus));
  };

  const makeDefaultCallBackStatus = status => {
    setLoading(false);
    setRenderOnStart(true);
  };

  const deleteAddressHandler = item => {
    dispatch(deleteUserDeliveryAddress(item.id, callBackStatus));
  };

  const callBackStatus = status => {
    if (status === 'success') {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'delete_icon',
        click_destination: screens.DELIVERY_ADDRESSES,
      });
      setTimeout(() => {
        dispatch(getUserDeliveryAddresses());
        setLoading(false);
      }, 600);
    } else {
      setLoading(false);
    }
  };

  return {
    deleteAddressHandler,
    defaultAddressHandler,
    deliveryaddresses,
    deliveryAddressesLoading,
    isDefaultPresent,
    loading,
    setLoading,
    renderOnStart,
  };
};

export default useDeliveryAddressHook;
