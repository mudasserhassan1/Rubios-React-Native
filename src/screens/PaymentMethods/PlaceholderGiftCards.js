import {getMScale} from '../../theme/metrics';
import ContentLoader, {Rect} from 'react-content-loader/native';
import React from 'react';
import {View} from 'react-native';

const BOX_WIDTH = getMScale(190);
const DISTANCE = 10;
const HEIGHT = getMScale(175);

const PlaceholderGiftCardItem = ({x}) => {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height={getMScale(215)}
      x={String(x)}
      width={220}>
      <Rect y={getMScale(15)} rx="15" ry="15" width={BOX_WIDTH} height={HEIGHT} />
    </ContentLoader>
  );
};
const PlaceholderGiftCards = () => {
  return (
    <View style={{flexDirection: 'row', paddingStart: getMScale(15)}}>
      {[0, 1, 2, 3].map(item => {
        const lineX = (item) * (BOX_WIDTH + DISTANCE);
        return <PlaceholderGiftCardItem x={lineX} />;
      })}
    </View>
  );
};
export default PlaceholderGiftCards;
