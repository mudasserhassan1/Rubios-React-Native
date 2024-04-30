import {useSelector} from 'react-redux';

const useRewardsOnBoardingSelector = () => {
  const {userViewedRewardsOnBoarded} = useSelector(state => state.newUser);
  return {
    userViewedRewardsOnBoarded,
  };
};
export default useRewardsOnBoardingSelector;
