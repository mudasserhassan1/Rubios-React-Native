import {FlatList, View} from 'react-native';
import React from 'react';
import RewardItem from '../../../components/RewardItem';
import RText from '../../../components/RText';
import useApplyRewardsHook from './useApplyRewardsHook';
import {getMScale, getVerticalScale} from '../../../theme/metrics';
import RewardsPlaceholder from './RewardsPlaceholder';
import {colors} from '../../../theme';

const ApplyRewards = ({accessibilityElementsHidden}) => {
  const {rewards, handelApplyReward, getRewardsLoading, currentRewardReferenceId} =
    useApplyRewardsHook();
  const renderRewardItem = item => {
    return (
      <RewardItem
        item={item}
        onItemPress={handelApplyReward}
        selectedRewardForAction={currentRewardReferenceId.current}
      />
    );
  };
  const renderRewardsList = () => {
    return (
      <FlatList
        contentContainerStyle={{flexGrow: 1, paddingEnd: getMScale(15)}}
        data={rewards}
        horizontal
        renderItem={renderRewardItem}
        keyExtractor={(item, index) => String(item?.item?.id || index)}
        listKey={'rewards'}
        key={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  if (rewards?.length === 0 && !getRewardsLoading) {
    return null;
  }
  return (
    <View
        accessibilityElementsHidden={accessibilityElementsHidden}
        style={{minHeight: getMScale(258), backgroundColor: '#F5F1E9'}}>
      <RText
        text={'Rewards available'}
        weight={'headerBold'}
        accessibilityRole={'header'}
        color={colors.secondary}
        textStyle={{
          marginVertical: getVerticalScale(16),
          marginStart: getMScale(15),
          textTransform: 'uppercase',
        }}
      />
      {getRewardsLoading ? (
        <RewardsPlaceholder />
      ) : (
        <View style={{paddingStart: getMScale(7)}}>{renderRewardsList()}</View>
      )}
    </View>
  );
};

export default ApplyRewards;
