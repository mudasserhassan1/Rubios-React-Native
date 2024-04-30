import React, {useEffect} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import RText from '../RText';
import {colors} from '../../theme';
// import {useNavigation} from '@react-navigation/native';
import {SCREEN_HEIGHT} from '../../theme/metrics';
import {constants} from '../../constants';

const LoadingOverlay = ({
  message = '',
  isLoading,
  withHeader,
  containerStyle,
  overlayWithoutIndicator,
}) => {
  // const navigation = useNavigation();
  // useEffect(() => {
  //   navigation.setParams({loading: isLoading});
  // }, [navigation, isLoading]);
  if (isLoading) {
    return (
      <View
        style={[
          styles.overlay,
          !withHeader && {alignItems: 'center', justifyContent: 'center'},
          containerStyle,
        ]}>
        {!overlayWithoutIndicator ? (
          <View
            style={{
              backgroundColor: colors.white,
              width: 60,
              height: 60,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              ...Platform.select({
                ios: {
                  marginTop: withHeader ? SCREEN_HEIGHT / 2 - constants.IOS_HEADER_HEIGHT : 0,
                },
                android: {
                  height: withHeader ? SCREEN_HEIGHT / 2 - constants.ANDROID_HEADER_HEIGHT : 0,
                },
              }),
            }}>
            <ActivityIndicator size="small" color={colors.secondary} />
          </View>
        ) : null}
        {message ? <RText textStyle={styles.message} text={message} /> : null}
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
    alignItems: 'center',
  },
  loader: {
    ...Platform.select({
      ios: {
        marginTop: SCREEN_HEIGHT / 2 - constants.IOS_HEADER_HEIGHT,
      },
      android: {
        height: SCREEN_HEIGHT / 2 - constants.ANDROID_HEADER_HEIGHT,
      },
    }),
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoadingOverlay;
