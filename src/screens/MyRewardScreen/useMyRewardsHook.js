import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useMemo, useRef, useState} from 'react';
import {getRewards, getRewardsLocked, getRewardsNew} from '../../redux/actions/reward';
import {getChallengeDetail, getChallenges} from '../../redux/actions/challenges';
import {
  getRedeemableRedemptionCode,
  getRewardRedemptionCode, getRewardRedemptionCodeSuccess,
} from '../../redux/actions/reward/redemption';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';
import {parseInt} from 'lodash';
import moment from 'moment';
import isAfter from "validator/es/lib/isAfter";

const useMyRewardsHook = () => {
  const [points, setPoints] = useState(0);
  const [titleText, setTitleText] = useState('');
  const [statusText, setStatusText] = useState('');

  const [index, setIndex] = useState(0);
  const {rewards, loading: loadingRewards} = useSelector(state => state.reward); //users/balance
  const {data, loading: loadingRedemptions} = useSelector(state => state.rewardNew); //checkins/balance used only for total points
  const {data: lockedRewards} = useSelector(state => state.rewardLocked); //meta.json

  const {rewards: availableOffers = [], active_redemptions: activeOffers = []} = rewards  || {}
  const {total_point_credits, total_debits} = data || {};

  const {redeemables: redeemAbles = []} = lockedRewards || {};

  const [refreshData, setRefreshData] = useState(false);
  const {
    challenges,
    challengeDetail = {},
    challengeDetailLoading = false,
  } = useSelector(state => state.challenges);

  const bottomSheetRef = useRef();
  const parentProgressWidth = useRef();
  const challengesBottomSheetRef = useRef();
  const qrcodeBottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['92%'], []);
  const challengeSheetSnapPoints = useMemo(() => ['70%'], []);
  const challengeSheetSnapPoints1 = useMemo(() => ['80%'], []);
  const challengeSheetSnapPoints2 = useMemo(() => ['90%'], []);
  const [rewardType, setRewardsType] = useState('');
  const [description, setDescription] = useState('');
  const [rewardsReedeemImage, setRewarReedeemImage] = useState(null);
  const [rewardName, setRewardName] = useState('');
  const [rewardExpiry, setRewardExpiry] = useState('');
  const currentDate = moment();
  const formattedCurrentDate = currentDate.format('YYYY-MM-DDTHH:mm:ssZ');

  const dispatch = useDispatch();
  const filteredRewardsOffer = filterDuplicates(availableOffers, 'name');

  function filterDuplicates(arr, key) {
    const seen = new Set();
    return arr?.filter(item => {
      const value = key ? item[key] : item;
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  const offers = useMemo(() => {
    const filteredOffers = filterDuplicates(availableOffers, 'name');
    const actualOffers = activeOffers.filter(offer => !offer?.redeemed_value && isAfter(offer?.expiring_at, new Date().toISOString()));
    const uniqueActualOffers = filterDuplicates(actualOffers, 'redeemable_id');

    const mappedOffers = [...uniqueActualOffers, ...filteredOffers].map(item => {
      return {
        // ...item,
        name: item?.name || item?.redeemable_name || '',
        reward_image_url: item?.reward_image_url || item?.redeemable_image_url || '',
        description: item?.description || item?.redeemable_description || '',
        reward_id: item?.reward_id || null,
        tracking_code: item?.redemption_tracking_code || null,
        redemption: item?.reward_id ? null : item,
        reward: item?.reward_id ? item : null
      }
    })
    return  filterDuplicates(mappedOffers, 'name');
  }, [availableOffers, activeOffers]);

  function shouldIncludeChallenge(challenge) {
    const challengeStartDate = challenge?.challenge_starting_at_tz;
    const challengeStatus = challenge?.challenge_status || '';
    if (
      challengeStatus === 'enrolled' &&
      (formattedCurrentDate >= challengeStartDate || challengeStartDate === null)
    ) {
      return true;
    }
    return false;
  }

  const filteredChallenges = challenges?.filter(shouldIncludeChallenge);

  useEffect(() => {
    dispatch(getRewardsNew());
    dispatch(getRewardsLocked());
    dispatch(getRewards());
    // dispatch(getChallenges());
    setRefreshData(false);
  }, [dispatch, refreshData]);

  useEffect(() => {
    const {banked_rewards = 0.0} = data || {};
    if (data && lockedRewards && !loadingRedemptions) {
      setPoints(parseInt(banked_rewards, 10) || 0);
    }
  }, [data, lockedRewards, loadingRedemptions]);

  const goToQRCode = (id, name, type, isAllow, image, description) => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'scan_in_store',
      click_destination: 'Open Redemption QR Code Modal Sheet',
    });
    if (isAllow) {
      setRewardsType(type);
      setDescription(description);
      setRewarReedeemImage(image);
      setRewardName(name);
      qrcodeBottomSheetRef?.current?.openSheet();
      dispatch(getRedeemableRedemptionCode(id, callBack));
    }
  };

  const openOffersQRCodeModal = (item) => {
    const {reward_id, name,description, reward_image_url, expiring_at, tracking_code } = item || {};
    logFirebaseCustomEvent(strings.click, {
      click_label: 'scan_in_store',
      click_destination: 'Open Offers QR Code Modal Sheet',
    });
    setRewardsType('reward');
    setDescription(description);
    setRewarReedeemImage(reward_image_url);
    setRewardName(name);
    setRewardExpiry(expiring_at);
    qrcodeBottomSheetRef?.current?.openSheet();
    if (reward_id && !tracking_code) {
      dispatch(getRewardRedemptionCode(reward_id, callBack));
    } else {
      dispatch(getRewardRedemptionCodeSuccess(item.redemption));
      dispatch(getRewards())
    }
  };

  const callBack = status => {
    dispatch(getRewards())
    if (status === 'failure') {
      qrcodeBottomSheetRef?.current?.closeSheet();
    }
  };

  const goToQRCodeForReward = (id, name, type, isAllow, description, rewardImage, expiry) => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'scan_in_store',
      click_destination: 'Open Rewards QR Code Modal Sheet',
    });
    if (isAllow) {
      setRewardsType(type);
      setDescription(description);
      setRewarReedeemImage(rewardImage);
      setRewardName(name);
      setRewardExpiry(expiry);
      dispatch(getRewardRedemptionCode(id, callBack));
    }
  };

  const getDetails = id => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'challenge',
      click_destination: 'Open Challenge Detail Modal Sheet',
    });
    dispatch(getChallengeDetail(id));
  };
  const openRewardsHistorySheet = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'rewards_&_redemption_history',
      click_destination: 'Open Rewards & Redemption Points History Modal Sheet',
    });
    bottomSheetRef?.current?.openSheet?.();
  };

  return {
    points,
    loadingRewards,
    loadingRedemptions,
    goToQRCode,
    goToQRCodeForReward,
    bottomSheetRef,
    snapPoints,
    setRefreshData,
    filteredChallenges,
    challengesBottomSheetRef,
    getDetails,
    challengeDetail,
    parentProgressWidth,
    challengeSheetSnapPoints,
    challengeSheetSnapPoints1,
    challengeSheetSnapPoints2,
    titleText,
    setTitleText,
    statusText,
    setStatusText,
    openRewardsHistorySheet,
    filteredRewardsOffer,
    qrcodeBottomSheetRef,
    rewardType,
    description,
    rewardsReedeemImage,
    rewardName,
    rewardExpiry,
    index,
    setIndex,
    openOffersQRCodeModal,
    challengeDetailLoading,
    redeemAbles,
    total_point_credits,
    total_debits,
    offers,
  };
};
export default useMyRewardsHook;
