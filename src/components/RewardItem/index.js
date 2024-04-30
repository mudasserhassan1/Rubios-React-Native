import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import RText from '../RText';
import {strings} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import ImageComponent from '../ImageComponent/ImageComponent';
import {RewardsItemPlaceholder} from '../../screens/CheckoutScreen/ApplyRewards/RewardsPlaceholder';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {getMScale} from '../../theme/metrics';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";
import {isIos} from "../../utils/sharedUtils";

const RewardItem = ({item, onItemPress, selectedRewardForAction}) => {
  const {basket} = useBasketSelector();
  const reward = item?.item || {};
  const {
    label,
    // name,
    // reward_image_url: rewardImageUrl,
    imageurl,
    // redeemed_value: points,
    points,
    redeemable_id: redeemAbleId,
    localType,
    reward_id: rewardId,
    reference,
  } = item?.item || {};

  const {isAccessibilityOn} = useUserSelector();
  const getPointsText = () => {
    if (points) {
      return points + ' Points';
    }
  };

  const reedemableIdFromRedux = basket?.appliedrewards?.[0]?.reference || '';
  const {loading: applyRewardLoading} = useSelector(state => state.applyRewardOnBasket);
  const {loading: removeRewardLoading} = useSelector(state => state.removeRewardFromBasket);

  const isAppliedRewards =
    redeemAbleId?.toString() === reedemableIdFromRedux ||
    reference?.toString() === reedemableIdFromRedux ||
    rewardId?.toString() === reedemableIdFromRedux;

  const showLoading = useMemo(() => {
    return (
      selectedRewardForAction === String(redeemAbleId) &&
      (applyRewardLoading || removeRewardLoading)
    );
  }, [applyRewardLoading, redeemAbleId, removeRewardLoading, selectedRewardForAction]);

  if (showLoading && !isAccessibilityOn) {
    return (
      <View style={{marginStart: getMScale(8)}}>
        <RewardsItemPlaceholder />
      </View>
    );
  }
  return (
    <View
        accessibilityState={isIos ?  {selected: isAppliedRewards}: {}}
        accessible={!(applyRewardLoading || removeRewardLoading)}
        accessibilityLabel={`${label}\n${localType === 'redemption' ? getPointsText() : ''}\n${isAppliedRewards ? strings.remove : strings.redeem}`}
        accessibilityHint={ isAppliedRewards ? 'activate to remove this reward from order' : 'activate to apply this reward in order'}
        onAccessibilityTap={() => onItemPress(reward)}
      style={[
        styles.container,
        isAppliedRewards && {borderColor: colors.secondary, borderWidth: 2},
      ]}>
      <ImageComponent source={{uri: imageurl}} resizeMode={'cover'} style={styles.image} />
      <View style={{width: '85%', alignSelf: 'center'}}>
        <RText
          text={label}
          numberOfLines={localType === 'redemption' ? 2 : 3}
          size={'xxs'}
          weight={'semiBold'}
          textStyle={styles.title}
        />
        {
            localType === 'redemption' ? (
                <RText
                    text={getPointsText()}
                    size={'xxs'}
                    color={colors.palette.primary_50}
                    weight={'semiBold'}
                    textStyle={styles.points}
                />
            ) : null
        }
      </View>
      <TouchableOpacity
          accessible={false}
          disabled={applyRewardLoading || removeRewardLoading}
          style={styles.apply}
          onPress={() => onItemPress(reward)}>
        <RText
            text={isAppliedRewards ? strings.remove : strings.redeem}
            color={colors.primaryLink}
            size={'xxs'}
            weight={'semiBold'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default RewardItem;
