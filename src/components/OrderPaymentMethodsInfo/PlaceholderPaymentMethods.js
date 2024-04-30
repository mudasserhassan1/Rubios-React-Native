import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import ContentLoader, {Rect} from 'react-content-loader/native';
import React from 'react';

const PlaceholderPaymentMethods = () => {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height={150}
      width={SCREEN_WIDTH}>
      <Rect x={String(getMScale(5))} y={20} rx="5" ry="5" width={'90%'} height={60} />
      <Rect x={String(getMScale(5))} y={90} rx="5" ry="5" width={'90%'} height={60} />
    </ContentLoader>
  );
};

export default PlaceholderPaymentMethods;
