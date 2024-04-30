import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {View, TextInput, Pressable, TouchableOpacity, findNodeHandle, AccessibilityInfo} from 'react-native';
import styles from './styles';
import MaskInput from 'react-native-mask-input';
import RText from '../RText';
import {colors} from '../../theme';
import {images} from '../../assets';
import ImageComponent from '../ImageComponent/ImageComponent';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {getMScale} from '../../theme/metrics';
import FaceIdIcon from '../../assets/svgs/FaceIdIcon';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";
import {isIos} from "../../utils/sharedUtils";

const InputField = forwardRef(
  (
    {
      value,
      editable = true,
      disabled = false,
      onPress,
      blurOnSubmit,
      keyboardType,
      onSubmitEditing,
      maxLength,
      onChangeText,
      placeholder,
      inputStyle,
      containerStyle,
      returnKeyType = 'next',
      label,
      labelBackgroundColor = colors.white,
      placeholderTextColor = colors.placeholder,
      onBlur,
      mask,
      error,
      isMaskedInput,
      pointerEvents,
      autoCapitalize,
      RightAccessoryComponent,
      isPasswordInput,
      handlePassVisibility,
      refInput,
      isBottomSheetInput,
      isBioMetricVisible,
      handleBiometricLogin,
        accessibilityLabelForLabel,
        accessibilityLabelForInput,
        maxFontSizeMultiplier = 1.3,
        allowFontScaling=isIos,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef();
    const [borderStyle, setBorderStyle] = useState({
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
    });
    const [securePasswordTextEntry, setSecurePasswordTextEntry] = useState(isPasswordInput);
    const [inputError, setInputError] = useState(error);

    const handlePasswordVisibility = () => setSecurePasswordTextEntry(prevState => !prevState);
      const {isAccessibilityOn = false} = useUserSelector();

    const inputErrorRef = useRef();

      useEffect(() => {
          if (isAccessibilityOn && inputError) {
              AccessibilityInfo.announceForAccessibility(inputError);
          }
      }, [isAccessibilityOn, inputError]);

    useEffect(() => {
      setInputError(error);
    }, [error]);

    const errorBorder = {
      borderColor: colors.error,
      borderWidth: 1,
    };
    const focus = () => {
      inputRef?.current?.focus?.();
    };

    const clearError = () => {
      setInputError('');
    };
    useImperativeHandle(ref, () => ({
      focus,
      clearError,
    }));

    const handleFocus = () => {
      setBorderStyle(prevState => ({...prevState, borderWidth: 2, borderColor: colors.secondary}));
    };
    const handleBlur = () => {
      setBorderStyle(prevState => ({...prevState, borderWidth: 1, borderColor: colors.border}));
      onBlur?.();
    };
    const InputComponent = useMemo(
      () => (isMaskedInput ? MaskInput : isBottomSheetInput ? BottomSheetTextInput : TextInput),
      [isBottomSheetInput, isMaskedInput],
    );

    const handleTextChange = text => {
      onChangeText(text);
      clearError();
    };

    const Label = ({value}) => {
      return (
        <View accessible accessibilityLabel={accessibilityLabelForLabel || value} style={styles.label}>
          <RText
            nativeId={'formLabel'}
            text={value}
            size={'xxs'}
            color={inputError ? colors.error : colors.primary}
          />
        </View>
      );
    };

    const PasswordVisibilityComponent = () => (
      <TouchableOpacity
        accessible={true}
        accessibilityRole={'button'}
        accessibilityLabel={securePasswordTextEntry ? 'Show password' : 'hide password'}
        accessibilityHint={securePasswordTextEntry ? 'activate to show password': 'activate to hide password'}
        style={styles.inputRightViewContainer}
        onPress={handlePasswordVisibility}>
        <ImageComponent
          source={securePasswordTextEntry ? images.eye_closed : images.eye_open}
          style={styles.inputRightImage}
        />
      </TouchableOpacity>
    );

    const BioMetricComponent = () => {
      return (
        <TouchableOpacity
          accessible={true}
          accessibilityRole={'button'}
          accessibilityLabel={'Biometric Login'}
          onPress={handleBiometricLogin}
          style={{alignSelf: 'center', right: getMScale(10)}}>
          <FaceIdIcon />
        </TouchableOpacity>
      );
    };
    const renderInputField = () => {
      return (
        <View>
          <View
            style={[styles.container, borderStyle, containerStyle, !!inputError && errorBorder]}>
            {label ? <Label value={label} /> : null}
            <InputComponent
              ref={inputRef}
              refInput={inputRef}
              value={value}
              editable={editable}
              maxLength={maxLength}
              blurOnSubmit={blurOnSubmit}
              returnKeyType={returnKeyType}
              keyboardType={keyboardType}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              allowFontScaling={allowFontScaling}
                maxFontSizeMultiplier={isIos ? maxFontSizeMultiplier : 1}
              placeholderTextColor={placeholderTextColor}
              mask={mask}
              onFocus={handleFocus}
              onSubmitEditing={onSubmitEditing}
              onBlur={handleBlur}
              secureTextEntry={securePasswordTextEntry}
              // accessibilityLabel={value || accessibilityLabelForInput || placeholder}
              style={[
                styles.input,
                !RightAccessoryComponent && !isPasswordInput && {width: '100%'},
                !editable && {color: colors.grey2},
                inputStyle,
              ]}
              pointerEvents={pointerEvents}
              autoCapitalize={autoCapitalize}
              {...rest}
            />
            {RightAccessoryComponent ? (
              <RightAccessoryComponent />
            ) : isBioMetricVisible ? (
              <BioMetricComponent />
            ) : isPasswordInput ? (
              <PasswordVisibilityComponent />
            ) : null}
          </View>
          {!!inputError && <RText ref={inputErrorRef} text={error} textStyle={styles.errorText} />}
        </View>
      );
    };

    if (!editable) {
      return (
        <Pressable
            accessibilityHint={'text field, dimmed'}
            accessible
            accessibilityValue={{text: value}}
            accessibilityState={isIos ? {disabled: true}: {}}
            disabled={disabled}
            onPress={onPress}>
          {renderInputField()}
        </Pressable>
      );
    }

    return renderInputField();
  },
);

export default InputField;
