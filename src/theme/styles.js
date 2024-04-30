import {StyleSheet} from 'react-native';
import { getScale } from "./metrics";

export const appStyles = StyleSheet.create({
  screen: {
    paddingHorizontal: getScale(15),
  },
});
