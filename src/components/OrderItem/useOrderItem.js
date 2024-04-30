import {formatTime} from '../../utils/timeUtils';

const useOrderItem = ({order}) => {
  const {
    id = '',
    timeplaced = '',
    vendorname,
    name,
    products,
    deliverymode,
    deliveryaddress = {},
  } = order || {};
  const orderDate = formatTime(timeplaced?.split(' ')[0], 'MMMM DD, YYYY');
  return {
    id,
    orderDate,
    vendorname,
    name,
    products,
    deliverymode,
    deliveryaddress
  };
};
export default useOrderItem;
