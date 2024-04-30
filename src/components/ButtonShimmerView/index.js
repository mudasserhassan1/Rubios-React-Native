import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {colors} from '../../theme';
import { getMScale } from "../../theme/metrics";

const ShimmerView = ({backgroundColor,isReorderEligible}) => {
  return (
    <ContentLoader
      speed={1}
      width={isReorderEligible ? '45%' : 200}
      height={getMScale(60)}
      viewBox="0 0 230 60"
      backgroundColor={backgroundColor}
      foregroundColor={colors.offWhite}>
      <Rect x="0" y="0" rx="28" ry="28" width={'100%'} height={getMScale(60)} />
    </ContentLoader>
  );
};

export default ShimmerView;
