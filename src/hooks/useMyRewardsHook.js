import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getRewards, getRewardsLocked, getRewardsNew} from '../redux/actions/reward';
import {screens} from '../constants';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';

import {resetAndNavigate} from '../utils/navigationUtils';
import {HeaderBackButton} from '@react-navigation/elements';
import {colors} from '../theme';
import React from 'react';
import {BackHandler} from 'react-native';

const useMyRewardsHook = () => {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [sections, setSections] = useState([]);
  const [rewardsAndRedeemPoints, setRewardsAndRedeemPoints] = useState([]);

  const {rewards, loading: loadingRewards} = useSelector(state => state.reward);
  const {data, loading: loadingRedemptions} = useSelector(state => state.rewardNew);
  const {data: lockedRewards} = useSelector(state => state.rewardLocked);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const route = useRoute();
  const {fromOrderConfirmation} = route.params || {};

  useEffect(() => {
    if (fromOrderConfirmation) {
      navigation.setOptions({
        gestureEnabled: false,
        headerBackVisible: false,
        headerLeft: () => (
          <HeaderBackButton
            label={'Back'}
            labelStyle={{color: colors.primary}}
            style={{marginLeft: -10}}
            onPress={() => resetAndNavigate(screens.LOCATION)}
          />
        ),
      });
    }
  }, [fromOrderConfirmation, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (fromOrderConfirmation) {
          resetAndNavigate(screens.LOCATION);
          return true;
        }
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [fromOrderConfirmation]),
  );

  useEffect(() => {
    dispatch(getRewardsNew());
    dispatch(getRewardsLocked());
    dispatch(getRewards());
  }, [dispatch]);

  useEffect(() => {
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
  }, [sections, rewards, loadingRewards]);

  useEffect(() => {
    const {account_balance_details = {}} = data || {};
    const {redeemable_points} = account_balance_details || {};
    const {redeemables: redeemAbles = []} = lockedRewards || {};

    if (data && lockedRewards && !loadingRedemptions) {
      setPoints(redeemable_points || 0);
      let redeemObject = {
        400: [],
        700: [],
        1300: [],
      };
      redeemAbles.forEach(redeem => {
        switch (redeem.points_required_to_redeem) {
          case 400:
            redeemObject['400'].push(redeem);
            break;
          case 700:
            redeemObject['700'].push(redeem);
            break;
          case 1300:
            redeemObject['1300'].push(redeem);
            break;
          default:
            break;
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
  }, [data, lockedRewards, loadingRedemptions]);

  const onHelpPress = () => {
    setOpen(true);
  };
  const goToQRCode = (id, name, type, isAllow) => {
    if (isAllow) {
      navigation.navigate(screens.REWARD_QR_CODE, {
        id: id,
        name: name,
        type: type,
      });
    }
  };
  return {
    open,
    setOpen,
    points,
    sections,
    rewardsAndRedeemPoints,
    loadingRewards,
    loadingRedemptions,
    onHelpPress,
    goToQRCode,
  };
};
export default useMyRewardsHook;
