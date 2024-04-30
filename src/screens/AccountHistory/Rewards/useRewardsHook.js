import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getAccountHistory} from '../../../redux/actions/account-history';

const useRewardsHook = () => {
  const dispatch = useDispatch();
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const {accountHistory, loading: dataLoading} = useSelector(state => state.accountHistory);

  useEffect(() => {
    dispatch(getAccountHistory('rewards'));
  }, []);

  const openDescriptionModal = () => {
    setShowDescriptionModal(true);
  };

  const closeDexcriptionnModal = () => {
    setShowDescriptionModal(false);
  };
  return {
    accountHistory,
    dataLoading,
    showDescriptionModal,
    openDescriptionModal,
    closeDexcriptionnModal,
  };
};
export default useRewardsHook;
