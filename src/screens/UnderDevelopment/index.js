import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {strings} from '../../constants';
import {colors} from '../../theme';
import RText from "../../components/RText";

const UnderDevScreen = () => {
  return (
    <View style={styles.container}>
      <RText textStyle={styles.textStyle}>{strings.under_dev}</RText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    color: colors.black,
  },
});

export default UnderDevScreen;
