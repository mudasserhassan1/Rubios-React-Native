import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';

const boxSize = 24;
const startPosition = 30;
const row1StartPosition = startPosition / 2.5;
const row1VPosition = 10;
const row1Height = 10;
const row1CWidth = 200;
const CalendarPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxSize}
      width={SCREEN_WIDTH}
      viewBox={`0 0 ${SCREEN_WIDTH * 0.9} ${boxSize}`}>
      <Rect
        x={row1StartPosition}
        y={row1VPosition}
        height={row1Height}
        width={row1CWidth}
        rx={'3'}
        ry={'3'}
      />
    </ContentLoader>
  );
};
export default React.memo(CalendarPlaceholder);
