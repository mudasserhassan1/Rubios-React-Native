import ContentLoader, {Rect} from 'react-content-loader/native';
import React from 'react';
import {colors} from '../../theme';
const TipItemPlaceholder = ({width, height, itemWidth, top, itemHeight}) => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={height}
      width={width}
      viewBox={`0 0 ${width} ${height}`}>
      <Rect x={0} y={top} height={itemHeight} rx={'15'} ry={'15'} width={itemWidth} />
    </ContentLoader>
  );
};
export default TipItemPlaceholder;
