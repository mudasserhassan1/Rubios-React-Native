import {StyleSheet} from 'react-native';
import {colors, spacing} from '../../theme';
import {getMScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  heading: {
    color: colors.primary,
    marginTop: getMScale(20),
  },
  errorSection: {
    flex: 2,
    backgroundColor: colors.separator,
    marginVertical: spacing.medium,
    borderRadius: 6,
  },
  errorSectionContentContainer: {
    padding: spacing.medium,
  },
  errorContent: {
    color: colors.error,
  },
  errorBacktrace: {
    marginTop: spacing.medium,
    color: colors.textDim,
  },
  resetButton: {
    backgroundColor: colors.secondaryColor,
    marginTop: getMScale(40),
  },
});

export default styles;
