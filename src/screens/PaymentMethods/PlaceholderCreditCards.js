import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import ContentLoader, {Rect} from 'react-content-loader/native';
import React from 'react';
import {View} from 'react-native';

const DISTANCE = 10;
const HEIGHT = getMScale(60);
const PlaceholderCreditCards = () => {
  const PlaceholderCreditCardItem = ({y}) => {
    return (
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        height={getMScale(75)}
        y={String(y)}
        width={SCREEN_WIDTH}>
        <Rect rx="10" ry="10" width={'90%'} height={HEIGHT} />
      </ContentLoader>
    );
  };
  return (
    <View style={{paddingHorizontal: getMScale(15), alignSelf: 'center', width: SCREEN_WIDTH}}>
      {[0, 1, 2, 3,4,5,6,7,8].map(item => {
        const lineY = item * (HEIGHT + DISTANCE);
        return <PlaceholderCreditCardItem y={lineY} />;
      })}
    </View>
  );
};
export default PlaceholderCreditCards;
