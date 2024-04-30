import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';

import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';
import {View} from 'react-native';
const boxHeight = getMScale(196);
const boxWidth = '100%';

const RewardsItemPlaceholder = () => {
  return (
    <>
      <ContentLoader
        speed={1}
        backgroundColor={colors.offWhite}
        foregroundColor={colors.white}
        height={boxHeight}
        width={boxWidth}
        viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
        <Rect x={0} y={0} height={boxHeight} rx={'15'} ry={'15'} width={'100%'} />
      </ContentLoader>

      <View
        style={{
          paddingHorizontal: getMScale(16),
          marginTop: getMScale(20),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <ContentLoader
          speed={1}
          backgroundColor={colors.offWhite}
          foregroundColor={colors.white}
          height={50}
          width={'50%'}
          viewBox={`0 0 ${250} ${50}`}>
          <Rect x={0} y={0} height={50} rx={'15'} ry={'15'} width={200} />
        </ContentLoader>
        <ContentLoader
          speed={1}
          backgroundColor={colors.offWhite}
          foregroundColor={colors.white}
          height={50}
          width={'50%'}
          viewBox={`0 0 ${250} ${50}`}>
          <Rect x={0} y={0} height={50} rx={'15'} ry={'15'} width={200} />
        </ContentLoader>
      </View>
      <View style={{marginTop: getMScale(30)}}>
        <ContentLoader
          speed={1}
          backgroundColor={colors.offWhite}
          foregroundColor={colors.white}
          height={10}
          width={'100%'}
          viewBox={`0 0 ${400} ${10}`}>
          <Rect x={0} y={0} height={10} rx={'15'} ry={'15'} width={400} />
        </ContentLoader>
      </View>
    </>
  );
};

export default React.memo(RewardsItemPlaceholder);
