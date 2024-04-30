import {useSelector} from 'react-redux';

const useUpsellsSelector = () => {
  const {loading, upsells = [], vendorId} = useSelector(state => state.getUpsells);

  return {
    upsells,
    loading,
    vendorId,
  };
};
export default useUpsellsSelector;
