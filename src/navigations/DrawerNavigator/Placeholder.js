import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {colors} from '../../theme';

const RewardsPlaceholder = () => {
  return (
    <ContentLoader
      speed={1}
      width={150}
      height={30}
      viewBox="0 0 150 30"
      backgroundColor={colors.grey}
      foregroundColor={colors.offWhite}>
      <Rect x="10" y="0" rx="8" ry="8" width="130" height="28" />
    </ContentLoader>
  );
};

export default React.memo(RewardsPlaceholder);
