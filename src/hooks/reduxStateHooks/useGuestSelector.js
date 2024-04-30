import {useSelector} from 'react-redux';

const useGuestSelector = () => {
  const {guestUser} = useSelector(state => state.guest);
  const {isGuestLogin: isGuest} = useSelector(state => state.guestLogin);

  return {
    guestUser,
    isGuest,
  };
};
export default useGuestSelector;
