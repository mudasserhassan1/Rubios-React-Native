import {useSelector} from 'react-redux';

const useNewUserSelector = () => {
  const {isOnBoarded} = useSelector(state => state.newUser);
  return {
    isOnBoarded,
  };
};
export default useNewUserSelector;
