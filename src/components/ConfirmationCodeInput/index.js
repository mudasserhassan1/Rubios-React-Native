import React from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {StyleSheet, Text} from 'react-native';
import {getMScale} from '../../theme/metrics';
import {colors} from '../../theme';
import {isIos} from "../../utils/sharedUtils";

const ConfirmationCodeInput = ({
  value,
  setValue,
  cellCount,
  containerStyle,
  cellStyle,
  errorMessage,
}) => {
  const CELL_COUNT = cellCount;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <CodeField
      accessible
      accessibilityHint={'Please enter otp'}
      ref={ref}
      {...props}
      value={value}
      autoFocus={false}
      autoComplete={'sms-otp'}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={[styles.codeFieldRoot, containerStyle]}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({index, symbol, isFocused}) => (
        <Text
          key={index}
          style={[
            styles.cell,
            cellStyle,
            errorMessage && {borderColor: colors.error},
            isFocused && styles.focusCell,
            symbol && {color: colors.black},
          ]}
          allowFontScaling={isIos}
          maxFontSizeMultiplier={1.3}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : '-')}
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 20, alignItems: 'center'},
  cell: {
    width: getMScale(50),
    height: getMScale(50),
    borderWidth: 1,
    lineHeight: 50,
    fontSize: 24,
    color: colors.black,
    borderRadius: getMScale(10),
    borderColor: colors.subTitleText,
    textAlign: 'center',
    fontFamily: 'LibreFranklin-Medium',
    alignSelf: 'center',
  },
  focusCell: {
    borderColor: colors.black,
  },

  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: colors.black,
  },
});
export default ConfirmationCodeInput;
