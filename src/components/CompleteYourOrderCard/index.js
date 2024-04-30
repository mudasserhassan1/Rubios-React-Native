import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import AddIconGreen from '../../assets/svgs/AddIconGreen';
import RText from '../../components/RText';

const MyOrderCard = () => {
  return (
    <View style={styles.profileImageContainer}>
      <View style={styles.profileImageCard}>
        <ImageComponent
          resizeMode={'contain'}
          style={styles.circularImage}
          source={images.onBoarding1}
        />
        <View style={styles.addlIconContainer} hitSlop={{top: 30, bottom: 20, left: 30, right: 30}}>
          <AddIconGreen />
        </View>
      </View>
      <View style={{marginTop: getVerticalScale(8)}}>
        <RText text={'Chips'} weight={'semiBold'} size={'xs'} color={colors.primary} />

        <RText
          text={'$ 1.00'}
          weight={'regular'}
          size={'xs'}
          color={colors.primary}
          textStyle={{marginTop: getVerticalScale(10)}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circularImage: {
    width: getMScale(65),
    height: getMScale(65),
    borderRadius: 33,
  },

  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageCard: {
    width: getMScale(100),
    height: getVerticalScale(100),
    borderRadius: getMScale(50),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addlIconContainer: {
    position: 'absolute',
    width: getMScale(22),
    height: getMScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    top: getMScale(2),
    left: getMScale(70),
  },
});

export default MyOrderCard;
