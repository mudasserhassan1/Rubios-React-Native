import {useSelector} from 'react-redux';

const useRewardsSelector = () => {
  const {rewards, loading: loadingRewards = false} = useSelector(state => state.reward);
  const {data, loading: loadingNewRewards = false} = useSelector(state => state.rewardNew);
  const {data: lockedRewards} = useSelector(state => state.rewardLocked);
  const {rewards: rewardsForCheckout, loading: checkoutRewardsLoading = false} = useSelector(
    state => state.getRewardForCheckout,
  );
  const isLoadingRewards = loadingRewards || loadingNewRewards;
  const isLoadingCheckoutRewards = loadingNewRewards || checkoutRewardsLoading;
  return {
    rewards,
    redemptions: data,
    lockedRewards,
    rewardsForCheckout,
    isLoadingCheckoutRewards,
    isLoadingRewards,
    loadingNewRewards,
  };
};
export default useRewardsSelector;
