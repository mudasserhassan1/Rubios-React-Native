import React from 'react';
import {View, StyleSheet} from 'react-native';

import useAppleAuth from '../../hooks/useAppleAuth';
import useFacebookAuth from '../../hooks/useFacebookAuth';

const SocialLoginOptions = ({disabled}) => {
  const {renderAppleButtonJSX} = useAppleAuth({disabled: disabled});
  const {renderFacebookButtonJSX} = useFacebookAuth({
    containerStyle: {},
    imageStyle: {width: 40, height: 40},
    disabled: disabled,
  });
  return (
    <View style={styles.loginWithOtherOptionsContainer}>
      {renderFacebookButtonJSX}
      {renderAppleButtonJSX()}
    </View>
  );
};

const styles = StyleSheet.create({
  loginWithOtherOptionsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
    width: '45%',
    alignSelf: 'center',
  },
});
export default SocialLoginOptions;
