import React from 'react';
import {View, ImageBackground} from 'react-native';

import styles from './styles';
import RText from '../RText';
import {colors} from '../../theme';
import {getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import {images} from '../../assets';
import RewardsOnBoarding1Screen from '../../assets/svgs/RewardsOnBoarding1Screen';
import {isIos} from '../../utils/sharedUtils';

const RewardOnboardingItem = ({item}) => {
  const {title, text, image} = item || {};

  const renderOnboardingContent = () => {
    return (
      <>
        <View style={styles.dividerLine}>
          <ImageBackground
            source={images.greenDivider}
            style={{width: SCREEN_WIDTH, height: 15, marginTop: 18}}
            resizeMode={'stretch'}
          />
        </View>
        <View style={styles.bottomTextWrapper}>
          <RText
            text={title}
            size={'lg'}
            weight={'bold'}
            color={colors.primary}
            textStyle={styles.titleStyle}
          />
          <View style={{marginTop: getVerticalScale(16)}}>
            <RText
              text={text}
              color={colors.primary}
              size={'xs'}
              textStyle={styles.subTitleStyle}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      {!image ? (
        <View style={styles.container}>
          <RewardsOnBoarding1Screen />
        </View>
      ) : (
        <View style={styles.secondIndexWrapper}>
          <ImageBackground
            source={image}
            style={{width: SCREEN_WIDTH, height: getVerticalScale(450), overflow: 'hidden'}}
            resizeMode={isIos ? 'stretch' : 'cover'}
          />
        </View>
      )}
      <View>{renderOnboardingContent()}</View>
    </View>
  );
};
export default RewardOnboardingItem;
