import {useEffect, useState} from 'react';
import {strings} from '../../constants';

export const INPUT_KEYS = {
  ADDRESS_1: 'address1',
  ADDRESS_2: 'address2',
  CITY: 'city',
  ZIP: 'zip',
};
const useAddEditAddressModal = ({
  selectedAddress,
  onClose,
  onCloseModal,
  isAddNew,
  onTapConfirm,
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    zip: '',
    isdefault: false,
  });
  const [error, setError] = useState({
    address1: '',
    address2: '',
    city: '',
    zip: '',
  });

  const {
    address1 = '',
    address2 = '',
    city = '',
    zip = '',
  } = deliveryAddress || {};

  useEffect(() => {
    if (!isAddNew) {
      setDeliveryAddress({
        address1: selectedAddress.streetaddress || selectedAddress.address1,
        address2: selectedAddress.building || selectedAddress.address2,
        city: selectedAddress.city || selectedAddress.city,
        zip: selectedAddress.zipcode || selectedAddress.zip,
        isdefault: selectedAddress.isdefault || false,
      });
    }
  }, [selectedAddress, isAddNew]);

  const handleInputChange = (text, key) => {
    if (key === INPUT_KEYS.ZIP) {
      text = text.replace(/[^0-9]/g, '');
    }
    setDeliveryAddress(prevState => ({...prevState, [key]: text}));
    setError(prevState => ({...prevState, [key]: ''}));
  };

  const onConfirmPress = () => {
    if (!address1.trim()) {
      setError(prevState => ({
        ...prevState,
        [INPUT_KEYS.ADDRESS_1]: strings.required_street_address,
      }));
    } else if (!city.trim()) {
      setError(prevState => ({
        ...prevState,
        [INPUT_KEYS.CITY]: strings.required_city,
      }));
    } else if (!zip.trim()) {
      setError(prevState => ({
        ...prevState,
        [INPUT_KEYS.ZIP]: strings.required_postcode,
      }));
    } else if (zip.trim()?.length < 5) {
      setError(prevState => ({
        ...prevState,
        [INPUT_KEYS.ZIP]: strings.postal_code_must_be_of_five_characters,
      }));
    } else {
      onCloseModal?.();
      onTapConfirm?.(deliveryAddress);
    }
  };

  const onCancelPress = () => {
    onClose?.();
    setError({address1: '', address2: '', city: '', zip: ''});
  };

  return {
    deliveryAddress,
    address1,
    address2,
    city,
    zip,
    error,
    handleInputChange,
    onConfirmPress,
    onCancelPress,
  };
};

export default useAddEditAddressModal;
