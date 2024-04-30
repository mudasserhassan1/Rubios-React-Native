import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';
const boxHeight = 80;
const startPosition = 10;

const c1Position = 10;

const c1StartPosition = startPosition;

const ItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={SCREEN_WIDTH}
      viewBox={`0 0 ${SCREEN_WIDTH} ${boxHeight}`}>
      <Rect x={c1StartPosition} y={c1Position} height={10} rx={'3'} ry={'3'} width={120} />
      <Rect x={c1StartPosition} y={c1Position + 20} height={10} rx={'3'} ry={'3'} width={'83%'} />
      <Rect x={c1StartPosition} y={c1Position + 40} height={10} rx={'3'} ry={'3'} width={'78%'} />
    </ContentLoader>
  );
};

const Placeholder = () => {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => (
        <ItemPlaceholder key={String(i)} />
      ))}
    </>
  );
};

export default React.memo(Placeholder);
