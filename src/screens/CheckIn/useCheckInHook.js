import {constants, strings} from '../../constants';
import {createCheckIn} from '../../redux/actions/check-in';
import {formatWithMask} from 'react-native-mask-input';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';

const useCheckInHook = () => {
  const {providerToken} = useSelector(state => state.provider);
  const {loading: loadingCheckIn} = useSelector(state => state.checkIn);
  const [barcode, setBarCode] = useState('');
  const [barCodeError, setBarCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handelBarCodeChange = text => {
    setBarCode(text?.trim());

    if (barCodeError !== '') {
      setBarCodeError('');
    }
  };

  const onSubmit = () => {
    if (!barcode) {
      setBarCodeError(strings.required);
    } else if (unmaskedBarCode.length >= 12) {
      setIsLoading(true);
      setBarCodeError('');
      dispatch(createCheckIn(unmaskedBarCode));
    } else {
      setBarCodeError(strings.bar_code_should_not_be_empty);
    }
  };

  const {masked: maskedBarCode, unmasked: unmaskedBarCode} = formatWithMask({
    text: barcode,
    mask: constants.MASKS.BAR_CODE_MASK,
  });

  return {
    providerToken,
    barcode,
    barCodeError,
    isLoading,
    handelBarCodeChange,
    onSubmit,
    maskedBarCode,
    loadingCheckIn,
  };
};

export default useCheckInHook;
