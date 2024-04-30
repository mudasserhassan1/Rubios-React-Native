import React from 'react';
import {View} from 'react-native';
import {StatusBar} from 'react-native';
import RText from '../../components/RText';
import styles from './styles';
import RButton from '../../components/RButton';
import {strings} from '../../constants';
import {getMScale} from '../../theme/metrics';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import {colors} from '../../theme';

export function ErrorDetails(props) {
  return (
    <View style={styles.contentContainer}>
      <StatusBar animated={true} backgroundColor="#61dafb" barStyle={'dark-content'} />
      <ImageComponent source={images.appCrash} style={{width: 150, height: 150}} />
      <RText
        textStyle={styles.heading}
        weight={'bold'}
        size={'lg'}
        text={strings.title}
        color={colors.primary}
      />
      <RText
        text={strings.friendlySubtitle}
        size={'xs'}
        color={colors.greyTextColor}
        textStyle={{
          marginTop: getMScale(10),
          textAlign: 'center',
          marginHorizontal: getMScale(40),
          lineHeight: getMScale(16),
        }}
      />
      <RButton buttonStyle={styles.resetButton} onPress={props?.onReset} title={strings.reset} />
    </View>
  );
}
