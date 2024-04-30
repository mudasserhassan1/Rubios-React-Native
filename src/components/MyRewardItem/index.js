import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import RText from '../RText';
import {strings} from '../../constants';
import {colors} from '../../theme';
import ImageComponent from '../ImageComponent/ImageComponent';

const RewardItem = ({item, onItemPress}) => {
  const reward = item?.item || {};
  const {
    label,
    name,
    reward_image_url: rewardImageUrl,
    imageurl,
    redeemed_value: points,
    redeemable_id: redeemAbleId,
    localType,
    reward_id: rewardId,
  } = item?.item || {};
  const getPointsText = () => {
    if (points) {
      return points + ' Points';
    }
  };
  // const reedemableIdFromRedux = basket?.appliedrewards?.[0]?.reference || '';

  // const isAppliedRewards =
  //   redeemAbleId?.toString() === reedemableIdFromRedux ||
  //   rewardId?.toString() === reedemableIdFromRedux;

  return (
    <View style={styles.container}>
      <ImageComponent
        source={{uri: localType === 'redemption' ? imageurl : rewardImageUrl}}
        resizeMode={'cover'}
        style={styles.image}
      />
      <View style={{width: '85%', alignSelf: 'center'}}>
        <RText
          text={localType === 'redemption' ? label : name}
          numberOfLines={2}
          size={'xxs'}
          weight={'semiBold'}
          ellipsizeMode={'middle'}
          textStyle={styles.title}
        />
        <RText
          text={localType === 'redemption' ? getPointsText() : ''}
          size={'xxs'}
          color={colors.palette.primary_50}
          weight={'semiBold'}
          textStyle={styles.points}
        />
        <TouchableOpacity style={styles.apply} onPress={() => onItemPress(reward)}>
          <RText
            text={strings.redeem}
            color={colors.primaryLink}
            size={'xxs'}
            weight={'semiBold'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RewardItem;
