import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import {View} from 'react-native';
const boxHeight = 80;


const RestaurantPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      width={SCREEN_WIDTH}
      height={boxHeight}
      viewBox={`0 0 ${SCREEN_WIDTH} ${boxHeight}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb">
      <Rect x="0" y="8" rx="3" ry="3" width="88" height="6" />
      <Rect x="0" y="26" rx="3" ry="3" width="88" height="6" />
      <Rect x="0" y="42" rx="3" ry="3" width="88" height="6" />
      <Rect x="0" y="60" rx="3" ry="3" width="88" height="6" />
      <Rect x="0" y="78" rx="3" ry="3" width="88" height="6" />
      <Rect x="280" y="8" rx="3" ry="3" width="88" height="6" />
      <Rect x="280" y="26" rx="3" ry="3" width="88" height="6" />
      <Rect x="280" y="42" rx="3" ry="3" width="88" height="6" />
      <Rect x="280" y="60" rx="3" ry="3" width="88" height="6" />
      <Rect x="280" y="78" rx="3" ry="3" width="88" height="6" />
    </ContentLoader>
  );
};

const CategoriesPlaceholder = () => {
  return (
    <View style={{marginTop: getMScale(8), marginStart: getMScale(32)}}>
      {[0].map((item, i) => (
        <RestaurantPlaceholder key={String(i)} />
      ))}
    </View>
  );
};

export default React.memo(CategoriesPlaceholder);
