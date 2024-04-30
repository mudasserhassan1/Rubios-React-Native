import {useEffect, useMemo, useState} from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {constants} from '../../constants';
import useOrderSelector from '../../hooks/reduxStateHooks/useOrderSelector';

const CALCULATION_KEYS = {
  bagTotal: 'Bag Total',
  subtotal: 'Subtotal',
  tax: 'Estimated Taxes and Fees',
  tip: 'Tip',
  deliveryFee: 'Delivery Fee',
  serviceFee: 'Service Fee',
  total: 'Total',
  tax_and_fees: 'Taxes & Fees',
};
const useOrderDetails = () => {
  const {basket, tipPercentage} = useBasketSelector();
  const {order = {}} = useOrderSelector();
  const [tipAmount, setTipAmount] = useState(0);

  const {
    products,
    deliverymode = '',
    discounts = [],
    fees = [],
    taxes,
    salestax,
    customerhandoffcharge,
    totalfees,
    total,
    subtotal,
    tip = 0,
  } = basket || order || {};
  const [cartCalculations, setCartCalculations] = useState({});
  const serviceFee = fees[0]?.amount;

  useEffect(() => {
    if (tipPercentage) {
      const amount = (tipPercentage * subtotal) / 100;
      setTipAmount(amount);
    } else if (tip) {
      setTipAmount(tip);
    }
  }, [subtotal, tip, tipPercentage]);

  const discountSubtotal = useMemo(() => {
    let discountsSum = 0.0;
    if (discounts.length > 0) {
      discountsSum = discounts.reduce((sum, item) => sum + item.amount, 0);
      return parseFloat(subtotal) - parseFloat(discountsSum);
    }
    return 0.0;
  }, [discounts, subtotal]);

  useEffect(() => {
    if (basket || order) {
      const mTax = calculateTaxAndFee();
      setCartCalculations({
        ...(discounts?.length > 0 && {bagTotal: parseFloat(subtotal).toFixed(2)}),
        subtotal: discountSubtotal
          ? parseFloat(discountSubtotal).toFixed(2)
          : parseFloat(subtotal).toFixed(2),
        tax: parseFloat(mTax).toFixed(2),
        ...(deliverymode === constants.handOffMode.DISPATCH && {
          deliveryFee: customerhandoffcharge,
        }),
        ...(tip > 0 && {tip: tipAmount.toFixed(2)}),
        total: parseFloat(total).toFixed(2),
      });
    }
  }, [
    basket,
    order,
    customerhandoffcharge,
    deliverymode,
    fees,
    products,
    salestax,
    subtotal,
    tip,
    tipAmount,
    total,
    discounts,
    discountSubtotal,
  ]);

  const calculateTaxAndFee = () => {
    let total = 0.0;
    if (basket || order) {
      if (taxes) {
        total = taxes.reduce((sum, tax) => sum + tax.tax, 0);
      }
      if (totalfees) {
        total = total + totalfees;
      }
    }
    return parseFloat(total).toFixed(2);
  };

  return {
    cartCalculations,
    CALCULATION_KEYS,
    salestax,
    serviceFee,
    basket,
    order,
    tipPercentage,
  };
};
export default useOrderDetails;
