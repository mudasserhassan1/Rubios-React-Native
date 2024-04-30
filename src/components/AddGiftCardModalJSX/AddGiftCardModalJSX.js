import React, {useEffect, useRef} from 'react';
import {
  View,
  Keyboard,
  TouchableOpacity,
  findNodeHandle,
  AccessibilityInfo
} from 'react-native';
import styles from './styles';
import {screens, strings} from '../../constants';
import RButton from '../RButton';
import InputField from '../InputField';
import useAddGiftCardHook from './useAddGiftCardHook';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import BottomSheetHeader from '../BottomSheetHeader/BottomSheetHeader';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";

const AddGiftCardModalJSX = ({onClose}) => {
  const {
    INPUTS,
    inputState,
    inputError,
    INPUT_KEYS,
    checkPin,
    isButtonDisabled,
    isLoading,
    handleInputChange,
    onSubmitAddGiftCard,
  } = useAddGiftCardHook({onClose});

  const {isAccessibilityOn} = useUserSelector();
  const headerRef = useRef();

  useEffect(() => {
    if (isAccessibilityOn) {
      const reactTag = findNodeHandle(headerRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [isAccessibilityOn])
  const renderInputs = () => {
    return INPUTS.map(item => {
      const {key, ...rest} = item || {};
      if (key === INPUT_KEYS.PIN && !checkPin) {
        return null;
      }
      return (
        <InputField
          key={key}
          value={inputState[key]}
          error={inputError[key]}
          onSubmitEditing={onSubmitAddGiftCard}
          isBottomSheetInput
          onChangeText={text => handleInputChange(key, text)}
          {...rest}
        />
      );
    });
  };
  return (
    <TouchableOpacity accessible={false} activeOpacity={1} style={styles.container} onPress={Keyboard.dismiss}>
      <View style={{height: '100%'}}>
        <BottomSheetHeader ref={headerRef} title={strings.add_gift_card} onClose={onClose} />
        <View style={{paddingHorizontal: getMScale(15), marginTop: getVerticalScale(10)}}>
          {renderInputs()}
        </View>
        <View style={styles.buttonContainer}>
          <RButton
              accessibilityHint={isButtonDisabled ? 'add gift card number to activate': 'activate to save gift card'}
            buttonStyle={styles.button}
            title={strings.save}
            loading={isLoading}
            click_label={strings.save}
            click_destination={screens.CHECKOUT}
            onPress={onSubmitAddGiftCard}
            disabled={isButtonDisabled}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default AddGiftCardModalJSX;
