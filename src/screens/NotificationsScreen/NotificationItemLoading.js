import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {ScrollView} from 'react-native';
import {colors} from '../../theme';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
const boxHeight = 130;
const boxWidth = SCREEN_WIDTH;

export const NotificationItemLoading = () => {
  return (
    <ContentLoader
      speed={1}
      backgroundColor={colors.offWhite}
      foregroundColor={colors.white}
      height={boxHeight}
      width={boxWidth}>
      <Rect x={0} y={0} height={boxHeight - 10} rx={'10'} ry={'10'} width={'90%'} />
      <Circle x={40} y={40} r={30} />
      <Rect x={80} height={15} width={getMScale(220)} y={20} />
      <Rect x={80} height={5} width={getMScale(180)} y={40} />
      <Rect x={80} height={5} width={getMScale(180)} y={50} />
    </ContentLoader>
  );
};

const NotificationsLoading = () => {
  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={{paddingHorizontal: getMScale(15)}}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item, i) => (
        <NotificationItemLoading key={String(i)} />
      ))}
    </ScrollView>
  );
};

export default React.memo(NotificationsLoading);
