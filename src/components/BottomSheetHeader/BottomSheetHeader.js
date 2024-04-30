import {colors} from '../../theme';
import RText from '../RText';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {getMScale} from '../../theme/metrics';
import CrossIcon from '../../assets/svgs/CrossIcon';
import React, {forwardRef} from 'react';
import BackImage from '../../assets/svgs/BackImage';

const BottomSheetHeader = forwardRef(({onClose, withBackIcon, title, loading, titleStyle, ...rest}, ref) => {
  return (
    <View ref={ref} style={styles.parent} {...rest}>
      {withBackIcon ? (
        <TouchableOpacity
          accessible
          accessibilityRole={'button'}
          accessibilityHint={'Close button, activate to close down bottom sheet.'}
          activeOpacity={0.7}
          onPress={onClose}
          disabled={loading}
          style={[styles.iconBackground, {left: getMScale(15)}]}>
          <BackImage />
        </TouchableOpacity>
      ) : null}
      <RText
        accessible
        accessibilityRole={'header'}
        accessibilityLabel={title}
        text={title}
        numberOfLines={1}
        weight={'headerBold'}
        size={'lg'}
        minimumFontScale={0.5}
        adjustsFontSizeToFit={true}
        textStyle={[styles.headerText, titleStyle]}
      />
      <TouchableOpacity
        accessible
        accessibilityLabel={'Close'}
        accessibilityRole={'button'}
        accessibilityHint={'activate to close down bottom sheet.'}
        activeOpacity={0.7}
        onPress={onClose}
        style={[styles.iconBackground, {right: getMScale(15)}]}>
        <CrossIcon />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  parent: {
    height: 62,
    backgroundColor: colors.bottomSheetHeaderColor,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    position: 'absolute',
    alignSelf: 'center',
    width: getMScale(32),
    height: getMScale(32),
    borderRadius: getMScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 1, height: 0},
        shadowRadius: 5,
        shadowOpacity: 0.1,
        shadowColor: colors.black,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerText: {
    textTransform: 'uppercase',
    width: '73%',
    textAlign: 'center',
  },
});
export default BottomSheetHeader;
