import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';

import {colors} from '../../theme';
const boxHeight = 30;
const boxWidth = 70;

const RewardsItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={boxWidth}
      viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
      <Rect x={0} y={0} height={boxHeight} rx={'15'} ry={'15'} width={'100%'} />
    </ContentLoader>
  );
};

export default React.memo(RewardsItemPlaceholder);
