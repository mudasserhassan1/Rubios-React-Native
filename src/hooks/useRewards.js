import {useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {screens} from '../constants';
import {getRewards, getRewardsLocked, getRewardsNew} from '../redux/actions/reward';
import useRewardsSelector from './reduxStateHooks/useRewardsSelector';
import useAuthSelector from './reduxStateHooks/useAuthSelector';
import useGuestSelector from './reduxStateHooks/useGuestSelector';
import useRewardsOnBoardingSelector from './reduxStateHooks/useRewardsOnBoardingSelector';

const useRewards = ({pointsOnly = false}) => {
  const [rewardPoints, setRewardPoints] = useState(0);
  const [sections, setSections] = useState([]);
  const [rewardsAndRedeemPoints, setRewardsAndRedeemPoints] = useState([]);

  const {rewards, redemptions, lockedRewards, isLoadingRewards} = useRewardsSelector();
  const {isGuest} = useGuestSelector();
  const {providerToken = {}} = useAuthSelector();
  const {user} = providerToken || {};

  const {first_name = ''} = user || {};

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userViewedRewardsOnBoarded = false} = useRewardsOnBoardingSelector();

  useFocusEffect(
    useCallback(() => {
      if (!isGuest) {
        if (!pointsOnly) {
          dispatch(getRewardsLocked());
          dispatch(getRewards());
        }
        dispatch(getRewardsNew());
      }
    }, [dispatch, pointsOnly, isGuest]),
  );

  useEffect(() => {
    if (!pointsOnly && !isGuest) {
      const allData = [];
      if (rewards || sections) {
        allData.push(
          {
            heading: 'Available MyRewards',
            meta: [{title: '', data: rewards || [], isRedeemItem: false}],
          },
          {heading: 'Redeem Points', meta: sections},
        );
        setRewardsAndRedeemPoints(allData);
      }
    }
  }, [sections, rewards, pointsOnly, isGuest]);

  useEffect(() => {
    const {banked_rewards = 0.0} = redemptions || {};
    // const {redeemable_points} = account_balance_details || {};
    const {redeemables: redeemAbles = []} = lockedRewards || {};
    if (!pointsOnly && !isGuest) {
      if (redemptions && lockedRewards && !isLoadingRewards) {
        // setRewardPoints(redeemable_points || 0);
        setRewardPoints(parseInt(banked_rewards, 10) || 0);
        let redeemObject = {
          400: [],
          700: [],
          1300: [],
        };
        redeemAbles.forEach(redeem => {
          const requiredPoints = redeem?.points_required_to_redeem;
          if ([400, 700, 1300].includes(requiredPoints)) {
            redeemObject[String(requiredPoints)].push(redeem);
          }
        });
        const redeemAblesSections = Object.keys(redeemObject).map(item => {
          if (redeemObject[item].length) {
            return {
              title: `${item} Points`,
              data: redeemObject[item],
              pointsVal: item,
              isRedeemItem: true,
            };
          }
        });
        setSections(redeemAblesSections);
      }
    }
    setRewardPoints(parseInt(banked_rewards, 10) || 0);
  }, [redemptions, lockedRewards, isLoadingRewards, pointsOnly, isGuest]);

  const startScanningProcess = (id, name, type, isAllow) => {
    if (isAllow) {
      navigation.navigate(screens.REWARD_QR_CODE, {
        id: id,
        name: name,
        type: type,
      });
    }
  };

  const navigateToRewards = useCallback(() => {
    return userViewedRewardsOnBoarded
      ? navigation.navigate(screens.REWARDS)
      : navigation.navigate(screens.REWARDS_ONBOARDING);
  }, [navigation, userViewedRewardsOnBoarded]);

  const navigateToSignup = useCallback(() => {
    return navigation.navigate('AuthStack', {
      screen: screens.SIGNUP,
      params: {comingFromSideMenu: true},
    });
  }, [navigation]);

  return {
    first_name,
    rewardPoints,
    rewardsDataList: sections,
    rewardsAndRedeemPoints,
    isLoadingRewards,
    startScanningProcess,
    navigateToRewards,
    isGuest,
    navigateToSignup,
  };
};
export default useRewards;
