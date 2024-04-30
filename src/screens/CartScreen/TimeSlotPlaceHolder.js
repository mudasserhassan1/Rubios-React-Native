import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';
import { View } from "react-native";
const boxHeight = 50;
const startPosition = 20;

const c1Position = 0;

const c1StartPosition = startPosition;
const c2R1Width = '90%';
const c2R1Height = 25;
const c2StartPosition = c1StartPosition;

const c2r1VPosition = c1Position + 15;

const TimeSlotsListItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={SCREEN_WIDTH}
      viewBox={`0 0 ${SCREEN_WIDTH} ${boxHeight}`}>
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

const TimeSlotsListPlacehodler = () => {
  return (
    <View style={{alignItems: 'center'}}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item, i) => (
        <TimeSlotsListItemPlaceholder key={String(i)} />
      ))}
    </View>
  );
};

export default React.memo(TimeSlotsListPlacehodler);
