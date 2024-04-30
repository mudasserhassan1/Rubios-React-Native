import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors} from '../../theme';
import {goBack} from '../../utils/navigationUtils';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import RText from '../../components/RText';
import BackImageWhiteIcon from '../../assets/svgs/BackImageWhiteIcon';

const ScreenHeader = () => {
  const {top} = useSafeAreaInsets();
  const handleBackButtonPress = () => {
    return goBack();
  };
  return (
    <>
      <View style={[styles.header, {paddingTop: top}]}>
        <View style={styles.headerStyle}>
          <View style={styles.parentWrapper}>
            <TouchableOpacity onPress={handleBackButtonPress}>
              <View style={{marginStart: 10}}>
                <BackImageWhiteIcon />
              </View>
            </TouchableOpacity>
            <View>
              <RText
                text={'MY REWARDS CODE'}
                weight={'bold'}
                size={'lg'}
                color={colors.white}
                textStyle={{
                  marginStart: getMScale(13),
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    backgroundColor: colors.transparent_shadow,
    height: getMScale(110),
  },
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: colors.black,
    elevation: 3,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingEnd: getMScale(16),
    alignItems: 'center',
  },
  parentWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backIconView: {marginStart: 20, height: 7},
  backIcon: {width: 20, height: 20},
  titleView: {
    width: '80%',
    paddingStart: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: getVerticalScale(5),
  },
  description: {textDecorationLine: 'underline'},
  cartIconView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    shadowColor: colors.black,
  },
  cartIcon: {width: 25, height: 25},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.primary_23,
    width: '90%',
    alignSelf: 'center',
    // marginVertical: getMScale(16),
    // marginHorizontal: getMScale(16),
  },
});
export default ScreenHeader;
