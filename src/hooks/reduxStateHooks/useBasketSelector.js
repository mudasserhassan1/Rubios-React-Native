import {useSelector} from 'react-redux';

const useBasketSelector = () => {
  const {
    basket,
    payment = {},
    calendar = {},
    createdTime = '',
    orderSubmit = false,
    defaultTip = false,
    tipPercentage = '',
    customTip = false,
    error,
    addresses,
    loading: basketLoading,
  } = useSelector(state => state.basket);
  const {products = []} = basket || {};
  const {
    allowedCards = {},
    defaultCards = {},
    billingSchemes = [],
    saveCreditCard = false,
  } = payment || {};
  const {data = {}, loading: allowedCardsLoading} = allowedCards || {};
  const {billingschemes: allowedBillingSchemes = []} = data ?? {};

  let sum = 0;
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    sum += product.quantity;
  }
  const cartCount = sum;

  return {
    basket,
    payment,
    allowedCards,
    defaultCards,
    billingSchemes,
    calendar,
    basketLoading,
    allowedBillingSchemes,
    createdTime,
    orderSubmit,
    error,
    products,
    cartCount,
    defaultTip,
    allowedCardsLoading,
    saveCreditCard,
    tipPercentage,
    customTip,
    addresses,
  };
};
export default useBasketSelector;
