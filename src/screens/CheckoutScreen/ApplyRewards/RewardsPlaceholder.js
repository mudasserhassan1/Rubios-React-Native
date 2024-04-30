import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {ScrollView} from 'react-native';
import {colors} from '../../../theme';
import {getMScale} from '../../../theme/metrics';
const boxHeight = 178;
const boxWidth = 135;

export const RewardsItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.white}
      foregroundColor={colors.offWhite}
      height={boxHeight}
      width={boxWidth}
      viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
      <Rect x={0} y={0} height={boxHeight} rx={'15'} ry={'15'} width={123} />
    </ContentLoader>
  );
};

const RewardsPlaceholder = () => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{paddingStart: getMScale(15)}}>
      {[0, 1, 2, 3, 4, 5].map((item, i) => (
        <RewardsItemPlaceholder key={String(i)} />
      ))}
    </ScrollView>
  );
};

export default React.memo(RewardsPlaceholder);
