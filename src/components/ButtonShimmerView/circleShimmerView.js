import ContentLoader, {Circle} from 'react-content-loader/native';
import React from 'react';

const circleShimmerView = ({backgroundColor}) => {
  return (
    <ContentLoader
      speed={2}
      width={63}
      height={63}
      viewBox="0 0 63 63"
      backgroundColor={backgroundColor}
      foregroundColor="#ecebeb">
      <Circle cx="31.5" cy="31.5" r="31.5" />
    </ContentLoader>
  );
};

export default circleShimmerView;
