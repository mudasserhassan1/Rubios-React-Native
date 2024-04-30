import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import { getMScale, SCREEN_WIDTH } from "../../theme/metrics";
import {colors} from '../../theme';
import { View } from "react-native";
const boxHeight = 80;
const startPosition = 15;

const c1Position = 0;

const c1StartPosition = startPosition;
const c2R1Width = 250;
const c2R1Height = 55;
const c2StartPosition = c1StartPosition + 50 + 50;

const c2r1VPosition = c1Position + 7;

const CategoryItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={SCREEN_WIDTH}
      viewBox={`0 0 ${SCREEN_WIDTH} ${boxHeight}`}>
      <Rect x={c1StartPosition} y={c1Position} height={70} rx={'5'} ry={'5'} width={70} />
      <Rect
        x={c2StartPosition}
        y={c2r1VPosition}
        height={c2R1Height}
        width={c2R1Width}
        rx={'3'}
        ry={'3'}
      />
    </ContentLoader>
  );
};

const CategoriesPlaceholder = () => {
  return (
    <View style={{marginTop:getMScale(16),marginStart:getMScale(16)}}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => (
        <CategoryItemPlaceholder key={String(i)} />
      ))}
    </View>
  );
};

export default React.memo(CategoriesPlaceholder);
