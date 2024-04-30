import {ActivityIndicator, View} from 'react-native';
import RText from '../RText';
import {strings} from '../../constants';
import React from 'react';
import {colors} from '../../theme';
import styles from './styles';

const ListPlaceholder = ({
  msgEmpty = strings.no_rewards_msg,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size={'large'} />
      ) : (
        <RText text={msgEmpty} />
      )}
    </View>
  );
};

export default ListPlaceholder;
