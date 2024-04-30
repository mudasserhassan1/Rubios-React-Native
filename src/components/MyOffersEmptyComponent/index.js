import React from 'react';
import {View} from 'react-native';
import RText from '../RText';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';
import styles from './styles';
import ImageComponent from '../ImageComponent/ImageComponent';
import {images} from '../../assets';

const MyOffersEmptyComponent = ({titleText, containerStyle, titleFontSize, titleWeight}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View accessible={false} style={{paddingStart: 15}}>
        <ImageComponent
          source={images.myOffers}
          style={{width: getMScale(102), height: getMScale(69)}}
        />
      </View>

      <View accessible style={{width: '58%', marginStart: getMScale(17)}}>
        <RText
          text={titleText}
          weight={titleWeight}
          size={titleFontSize}
          color={colors.primary}
          textStyle={styles.titleText}>
          {' '}
        </RText>
      </View>
    </View>
  );
};

export default MyOffersEmptyComponent;
