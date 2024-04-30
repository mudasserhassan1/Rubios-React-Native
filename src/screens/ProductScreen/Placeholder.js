import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {memo} from 'react';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import {Circle} from 'react-native-svg';

const BOX_SIZE = 70;
const DISTANCE = 10;
const LINE_HEIGHT = 12;

const Placeholder = ({loading}) => {
  if (!loading) {
    return null;
  }
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height={300}
      width={SCREEN_WIDTH}>
      {[0, 1, 2, 3, 4, 5, 6].map(j => {
        const lineY = (j + 0.5) * (BOX_SIZE + DISTANCE);
        return (
          <>
            <Circle r={'35'} x={String(getMScale(70))} y={getMScale(lineY)} />
            <Rect
              x={String(getMScale(110))}
              y={getMScale(lineY - 20)}
              rx="5"
              ry="5"
              width={String(getMScale(250))}
              height={LINE_HEIGHT}
            />
            <Rect
              x={String(getMScale(110))}
              y={getMScale(lineY)}
              rx="5"
              ry="5"
              width={String(getMScale(80))}
              height={LINE_HEIGHT}
            />
          </>
        );
      })}
    </ContentLoader>
  );
};

export default memo(Placeholder);
