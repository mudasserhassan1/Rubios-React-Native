import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getAccountHistory} from '../../../redux/actions/account-history';

const usePointsHook = () => {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const dispatch = useDispatch();
  const {pointHistory = [], loading: dataLoading} = useSelector(state => state.accountHistory);

  useEffect(() => {
    dispatch(getAccountHistory('checkins'));
  }, []);

  const openDescriptionModal = () => {
    setShowDescriptionModal(true);
  };

  const closeDexcriptionnModal = () => {
    setShowDescriptionModal(false);
  };

  return {
    pointHistory,
    dataLoading,
    showDescriptionModal,
    openDescriptionModal,
    closeDexcriptionnModal,
  };
};
export default usePointsHook;
