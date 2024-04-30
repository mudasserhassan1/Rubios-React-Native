import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {View} from 'react-native';
import {colors} from '../../theme';

const boxHeight = 300;
const boxWidth = 300;

const RewardsItemPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.white}
      foregroundColor={colors.offWhite}
      height={boxHeight}
      width={boxWidth}
      viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
      <Rect x={0} y={0} height={boxHeight} rx={'15'} ry={'15'} width={'100%'} />
    </ContentLoader>
  );
};

const RewardsPlaceholder = () => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 25}}>
      <RewardsItemPlaceholder />
    </View>
  );
};

export default React.memo(RewardsPlaceholder);
