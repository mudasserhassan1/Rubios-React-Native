import FastImage from 'react-native-fast-image';
import {useMemo} from "react";
import {formatImageUrl} from "../../utils/sharedUtils";
import {logToConsole} from "../../configs";
const ImageComponent = ({
  source,
  style,
  tintColor,
  resizeMode = 'contain',
  accessibilityHint,
  accessible,
  ...rest
}) => {

  const isObject = typeof source === 'object';

  const imageSource = useMemo(() => {
    if (isObject) {
      const {uri} = source || {};
      return {uri: formatImageUrl(uri)}
    }
    return source;
  }, [source]);

   // logToConsole({isObject, source, imageSource: imageSource.uri})

  return (
    <FastImage
      accessible={accessible}
      source={imageSource}
      tintColor={tintColor}
      style={style}
      resizeMode={resizeMode}
      accessibilityHint={accessibilityHint}
      {...rest}
    />
  );
};

export default ImageComponent;
