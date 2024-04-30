import React from 'react';
import {View} from 'react-native';
import TipItemPlaceholder from './TipItemPlaceholder';
import { getMScale } from "../../theme/metrics";
const boxHeight = getMScale(25);
const boxWidth = getMScale(80);

const TipsPlaceholder = () => {
  return (
    <View style={{flexDirection: 'row'}}>
      {[0, 1, 2].map((item, i) => (
        <TipItemPlaceholder
          top={0}
          key={String(i)}
          width={boxWidth}
          height={boxHeight}
          itemWidth={getMScale(76)}
          itemHeight={boxHeight}
        />
      ))}
    </View>
  );
};

export default React.memo(TipsPlaceholder);
