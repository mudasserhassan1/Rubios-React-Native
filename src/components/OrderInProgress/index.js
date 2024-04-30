import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import RightArrowBlackIcon from '../../assets/svgs/RightArrowBlackIcon';
import RText from '../RText';
import {colors} from '../../theme';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import styles from './styles';

const OrderInProgress = ({
  Image,
  titleText,
  subTitle,
  onEditPress,
  containerStyle,
  titleFontSize,
  titleWeight,
  subTitleSize,
    accessible = true,
}) => {
  return (
    <View accessible={accessible} accessibilityHint={'activate to navigate to order status screen'}  onAccessibilityTap={onEditPress} style={[styles.container, containerStyle]}>
      <View style={{paddingStart: 15}}>
        <Image />
      </View>

      <View style={{width: '58%', marginStart: getMScale(17)}}>
        <RText
          text={titleText}
          weight={titleWeight}
          size={titleFontSize}
          color={colors.primary}
          textStyle={styles.titleText}>
          {' '}
        </RText>

        {subTitle ? (
          <RText
            text={subTitle}
            color={colors.primary}
            size={subTitleSize}
            numberOfLines={2}
            ellipsizeMode={'tail'}
            textStyle={styles.subTitleText}
          />
        ) : null}
      </View>

      <TouchableOpacity
        accessible
        accessibilityHint={'arrow button, activate to open Order status screen'}
        hitSlop={{top: 60, bottom: 60, left: SCREEN_WIDTH, right: 25}}
        onPress={onEditPress}
        activeOpacity={0.9}>
        <View style={{paddingEnd: getMScale(25)}}>
          <RightArrowBlackIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderInProgress;
