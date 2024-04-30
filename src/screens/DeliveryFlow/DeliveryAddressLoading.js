import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {ScrollView} from 'react-native';
import {colors} from '../../theme';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
const boxHeight = 90;
const boxWidth = SCREEN_WIDTH;

const DeliveryAddressItemLoading = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={boxWidth}>
      <Rect x={0} y={0} height={boxHeight - 10} rx={'10'} ry={'10'} width={'90%'} />
      <Circle x={40} y={40} r={30} />
      <Rect x={80} height={10} width={getMScale(180)} y={20} />
      <Rect x={80} height={10} width={getMScale(150)} y={40} />
    </ContentLoader>
  );
};

const DeliveryAddressLoading = () => {
  return (
    <ScrollView style={{flex: 1, marginTop: getMScale(10)}}>
      {[0, 1, 2, 3, 4, 5].map((item, i) => (
        <DeliveryAddressItemLoading key={String(i)} />
      ))}
    </ScrollView>
  );
};

export default React.memo(DeliveryAddressLoading);
