import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {colors} from '../../theme';
import {ScrollView, View} from 'react-native';
const boxHeight = 110;
const boxWidth = 150;
const startPosition = 20;

const c1Position = 10;

const c1StartPosition = startPosition;
const c2R1Width = 130;
const c2R1Height = 80;
const c2StartPosition = c1StartPosition;

const c2r1VPosition = c1Position + 15;

const DaysItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={boxWidth}
      viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
      <Rect
        x={c2StartPosition}
        y={c2r1VPosition}
        height={c2R1Height}
        width={c2R1Width}
        rx={'15'}
        ry={'15'}
      />
    </ContentLoader>
  );
};

const DaysListPlaceholder = () => {
  return (
    <View style={{paddingBottom: 8}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[0, 1, 2, 3, 4, 5, 6].map((item, i) => (
          <DaysItemPlaceholder key={String(i)} />
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(DaysListPlaceholder);
