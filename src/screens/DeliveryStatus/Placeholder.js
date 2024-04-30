import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {ScrollView} from 'react-native';
import {getMScale} from '../../theme/metrics';
import {colors} from '../../theme';
const boxHeight = 150;
const boxWidth = 400;

const Placeholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.white}
      foregroundColor={colors.offWhite}
      height={boxHeight}
      width={boxWidth}
      viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
      <Rect x={0} y={0} height={boxHeight} rx={'15'} ry={'15'} width={400} />
    </ContentLoader>
  );
};

const RewardsPlaceholder = () => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{paddingStart: getMScale(15)}}>
      {[0].map((item, i) => (
        <Placeholder key={String(i)} />
      ))}
    </ScrollView>
  );
};

export default React.memo(RewardsPlaceholder);
