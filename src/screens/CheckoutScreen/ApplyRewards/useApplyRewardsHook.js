import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getRewardsForCheckoutRequest} from '../../../redux/actions/reward/checkout';
import {getRewardsNew} from '../../../redux/actions/reward';
import {applyRewardOnBasketRequest} from '../../../redux/actions/reward/checkout/apply';
import {removeRewardFromBasketRequest} from '../../../redux/actions/reward/checkout/remove';
import useBasketSelector from '../../../hooks/reduxStateHooks/useBasketSelector';
import useRestaurantInfoSelector from '../../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {Alert} from 'react-native';
import {logFirebaseCustomEvent} from '../../../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../../../constants';

const useApplyRewardsHook = () => {
  const [rewards, setRewards] = useState([]);

  const currentRewardReferenceId = useRef(null);
  const currentMembershipId = useRef(null);

  const {basket} = useBasketSelector();
  const {restaurant = {}} = useRestaurantInfoSelector();
  const {id: restaurantId} = restaurant || {};

  const {loading: applyRewardLoading} = useSelector(state => state.applyRewardOnBasket);
  const {loading: removeRewardLoading} = useSelector(state => state.removeRewardFromBasket);
  const {rewards: qualifyingRewards, loading: loadingRewards} = useSelector(
    state => state.getRewardForCheckout,
  );
  const {data: rewardsRedemptionsData, loading: loadingRedemptions} = useSelector(
    state => state.rewardNew,
  );
  const {authToken: mAuthToken} = useSelector(state => state.auth);

  const getRewardsLoading = loadingRewards || loadingRedemptions;

  const dispatch = useDispatch();

  useEffect(() => {
    if (restaurantId) {
      dispatch(getRewardsForCheckoutRequest(restaurantId, mAuthToken?.authtoken));
      dispatch(getRewardsNew());
    }
  }, [dispatch, mAuthToken?.authtoken, restaurantId]);

  useEffect(() => {
    if (qualifyingRewards?.length) {
      let finalRewards = [];
      let qualifyingIds = {};
      qualifyingRewards.forEach(reward => {
        qualifyingIds[reward.reference] = reward;
        qualifyingIds[reward.externalreference] = reward;
      });
      let offers = [];
      if (rewardsRedemptionsData?.rewards?.length) {
        rewardsRedemptionsData.rewards.forEach(rew => {
          if (rew.type === 'reward') {
            if (rew.redeemable_id && qualifyingIds[rew.redeemable_id]) {
              offers.push({
                ...rew,
                localType: 'reward',
                label: qualifyingIds[rew.redeemable_id].label,
                membershipid: qualifyingIds[rew.redeemable_id].membershipid,
                imageurl: qualifyingIds[rew.redeemable_id].imageurl,
              });
              delete qualifyingIds[rew.redeemable_id];
            }
          }

          // if (rew.reward_id && qualifyingIds[rew.reward_id]) {
          //   const {label, membershipid, imageurl, reference} = qualifyingIds[rew.reward_id] || {};
          //   offers.push({
          //     ...rew,
          //     localType: 'reward', //offers
          //     label,
          //     membershipid,
          //     imageurl,
          //     reference,
          //   });
          //   delete qualifyingIds[rew.reward_id];
          // }
        });
        //sorting offers based on expiry date
        offers = offers.sort(function (a, b) {
          return new Date(a.expiring_at_tz) - new Date(b.expiring_at_tz);
        });
        finalRewards.push(...offers);
      }
      if (rewardsRedemptionsData && rewardsRedemptionsData?.redeemables?.length) {
        rewardsRedemptionsData?.redeemables?.forEach(rew => {
          if (rew.redeemable_id && qualifyingIds[rew.redeemable_id]) {
            finalRewards.push({
              ...rew,
              localType: 'redemption',
              membershipid: qualifyingIds[rew.redeemable_id].membershipid,
              label: qualifyingIds[rew.redeemable_id].label,
              imageurl: qualifyingIds[rew.redeemable_id].imageurl,
            });
            delete qualifyingIds[rew.redeemable_id];
          }
        });
      }
      // if (rewardsRedemptionsData?.banked_redemptions?.length) {
      //   rewardsRedemptionsData.banked_redemptions.forEach(rew => {
      //     if (rew.redeemable_id && qualifyingIds[rew.redeemable_id]) {
      //       const {membershipid, label, imageurl, reference} =
      //         qualifyingIds[rew.redeemable_id] || {};
      //       finalRewards.push({
      //         ...rew,
      //         localType: 'redemption', //reward points
      //         membershipid,
      //         label,
      //         imageurl,
      //         reference,
      //       });
      //       delete qualifyingIds[rew.redeemable_id];
      //     }
      //   });
      // }
      // const uniqueRewards = [...new Set(finalRewards.map(item => item.reference))].map(item => {
      //   let singleItem = finalRewards.filter(fr => fr.reference === item)[0];
      //   return singleItem;
      // });

      setRewards(
        finalRewards.sort(function (a, b) {
          if (a?.points && b?.points) {
            return (b?.points || 0) - (a?.points || 0);
          }
        }),
      );
    }
  }, [qualifyingRewards, rewardsRedemptionsData]);

  const handelApplyReward = reward => {
    applyReward(reward.membershipid, reward.redeemable_id.toString());
  };

  function handleReplace() {
    const request = {
      membershipid: currentMembershipId.current,
      references: [String(currentRewardReferenceId.current)],
    };
    logFirebaseCustomEvent(strings.click, {
      click_label: 'remove',
      click_destination: screens.CHECKOUT,
    });
    dispatch(applyRewardOnBasketRequest(basket?.id, request));
  }

  const applyReward = (membershipID, redeemableId) => {
    const request = {
      membershipid: membershipID,
      references: [String(redeemableId)],
    };
    currentRewardReferenceId.current = redeemableId;
    currentMembershipId.current = membershipID;
    if (basket?.appliedrewards?.filter(reward => reward.reference === redeemableId).length > 0) {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'redeem',
        click_destination: screens.CHECKOUT,
      });
      dispatch(
        removeRewardFromBasketRequest(basket?.id, parseInt(basket.appliedrewards[0].rewardid, 10)),
      );
    } else {
      if (basket?.appliedrewards?.length > 0) {
        Alert.alert(
          'Replace Reward',
          'Only one reward can be selected for an order. Do you want to replace the current reward?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Replace',
              onPress: handleReplace,
            },
          ],
        );
      } else {
        dispatch(applyRewardOnBasketRequest(basket?.id, request));
      }
    }
  };

  return {
    rewards,
    handelApplyReward,
    handleReplace,
    getRewardsLoading,
    applyRewardLoading,
    removeRewardLoading,
    currentRewardReferenceId,
  };
};
export default useApplyRewardsHook;
