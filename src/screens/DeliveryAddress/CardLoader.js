import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';
const boxHeight = 80;
const c1Position = 0;

const CategoryItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={SCREEN_WIDTH}
      viewBox={`0 0 ${SCREEN_WIDTH} ${boxHeight}`}>
      {/**/}

      <Circle cx="50" cy="30" r="30" />
      <Rect x="100" y="10" rx="3" ry="3" width="80" height="6" />
      <Rect x="100" y="30" rx="3" ry="3" width="200" height="6" />
      <Rect x={350} y={c1Position} height={55} rx={'5'} ry={'5'} width={55} />
    </ContentLoader>
  );
};

const CategoriesPlaceholder = () => {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => (
        <CategoryItemPlaceholder key={String(i)} />
      ))}
    </>
  );
};

export default React.memo(CategoriesPlaceholder);
