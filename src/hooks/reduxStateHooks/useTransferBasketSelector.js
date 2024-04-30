import {useSelector} from 'react-redux';

const useTransferBasketSelector = () => {
  const {
    data = {},
    loading: transferredBasketLoading,
    error: transferredBasketError,
  } = useSelector(state => state.basketTransferReducer);

  const {basket: transferredBasket = null, itemsnottransferred: itemsNotTransferred = []} =
    data || {};
  return {
    transferredBasketLoading,
    transferredBasketError,
    transferredBasket,
    itemsNotTransferred,
  };
};
export default useTransferBasketSelector;
