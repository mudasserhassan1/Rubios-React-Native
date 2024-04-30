import {useSelector} from 'react-redux';
import {useMemo} from 'react';

const useModalSheetStatusSelector = () => {
  const {is_home_side_bar_modal_opened = false, is_user_as_qr_code_modal_opened = false} =
    useSelector(state => state.modalSheetStatus);

  const isAccessibilityEnabledOnHomeScreen = useMemo(() => {
    return !(is_home_side_bar_modal_opened || is_user_as_qr_code_modal_opened);
  }, [is_home_side_bar_modal_opened, is_user_as_qr_code_modal_opened]);

  return {
    isAccessibilityEnabledOnHomeScreen,
  };
};
export default useModalSheetStatusSelector;
