import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {ScrollView} from 'react-native';
import {colors} from '../../theme';
const boxHeight = 20;
const boxWidth = 200;

const RewardsItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={'rgba(255,255,255,0.3)'}
      foregroundColor={colors.offWhite}
      height={boxHeight}
      width={boxWidth}
      viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
      <Rect x={0} y={0} height={boxHeight} rx={'15'} ry={'15'} width={200} />
    </ContentLoader>
  );
};

const RewardsPlaceholder = () => {
  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal>
      {[0].map((item, i) => (
        <RewardsItemPlaceholder key={String(i)} />
      ))}
    </ScrollView>
  );
};

export default React.memo(RewardsPlaceholder);
