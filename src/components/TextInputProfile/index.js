import React, {useRef, useImperativeHandle, useState, useEffect} from 'react';
import {View, TextInput as RNTextInput, TouchableOpacity, Platform} from 'react-native';
import EditPencilIcon from '../../assets/svgs/EditPencilIcon';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {colors} from '../../theme';
import RText from '../RText';
import {isIos} from '../../utils/sharedUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';

const MyTextInput = React.forwardRef(
  (
    {
      label,
      key,
      placeholder,
      value,
      onChangeText,
      keyboardType,
      blurOnSubmit,
      autoCapitalize,
      error,
      onSubmitEditing,
      disabled,
      onPasswordTap,
      onPhoneTap,
      editable,
      hideOnBlur,
      returnKeyType,
    },
    ref,
  ) => {
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [inputError, setInputError] = useState(error);
    const [loading, setLabelLoading] = useState(false);

    // const {checkIfDataUpdated} = useProfileHook();

    useEffect(() => {
      setInputError(error);
    }, [error]);

    const clearError = () => {
      setInputError('');
    };

    const handleIconClick = () => {
      if (label === 'Password') {
        logFirebaseCustomEvent(strings.click, {
          click_label: 'Password',
          click_destination: 'Open Change Password Modal Sheet',
        });
        onPasswordTap();
      } else if (label === 'Phone') {
        logFirebaseCustomEvent(strings.click, {
          click_label: 'Phone',
          click_destination: 'Open Change Phone Modal Sheet',
        });
        onPhoneTap();
      } else if (inputRef?.current) {
        logFirebaseCustomEvent(strings.click, {
          click_label: inputRef?.current,
          click_destination: `Make ${inputRef?.current} Field Editable`,
        });
        inputRef?.current?.focus();
        setIsFocused(true);
      }
    };

    const handleInputFocus = () => {
      setIsFocused(true);
    };

    const handleInputBlur = () => {
      setIsFocused(false);
      // checkIfDataUpdated();
    };

    useImperativeHandle(ref, () => ({
      clearError,
      focusInput: () => {
        if (inputRef.current) {
          inputRef.current.focus();
          setIsFocused(true);
        }
      },
    }));

    return (
      <View style={{marginTop: isIos ? 10 : 5, marginBottom: isIos ? 7 : 0}}>
        <RText text={label} color={colors.subTitleText} size={'xxs'} />
        <View style={[styles.textInputContainer, isFocused && styles.focused]}>
          <RNTextInput
            ref={inputRef}
            style={styles.input}
            allowFontScaling={isIos}
            maxFontSizeMultiplier={1.3}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            blurOnSubmit={blurOnSubmit}
            autoCapitalize={autoCapitalize}
            onSubmitEditing={onSubmitEditing}
            disabled={disabled}
            editable={editable}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            hideOnBlur={hideOnBlur}
            returnKeyLabel={'done'}
            returnKeyType={returnKeyType}
          />
          {!isFocused && !disabled ? (
            <TouchableOpacity
              accessible
              accessibilityHint={
                label === 'password'
                  ? 'double tap to open password update modal'
                  : label === 'Phone'
                  ? 'double tap top open to open Phone update modal.'
                  : `double tap on ${inputRef?.current}  to make Field Editable`
              }
              onPress={handleIconClick}>
              <EditPencilIcon />
            </TouchableOpacity>
          ) : (
            <View style={{height: getMScale(25)}} />
          )}
        </View>
        {!!inputError && <RText text={error} size={'xxs'} color={colors.error} />}
        {isFocused ? (
          <View style={styles.greyHorizontalLineStyle} />
        ) : (
          <View style={styles.emptyGreyHorizontalLineStyle} />
        )}
      </View>
    );
  },
);

const styles = {
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    color: colors.primary,
    fontFamily: 'LibreFranklin-SemiBold',
    // fontSize: getMScale(16),
    letterSpacing: 0.15,
    marginTop: getMScale(7),
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        height: getVerticalScale(18),
      },
      android: {
        height: getVerticalScale(45),
      },
    }),
  },
  focused: {
    borderColor: colors.subTitleText,
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.subTitleText,
    width: '90%',
    marginTop: getVerticalScale(5),
    // marginEnd: getMScale(40),
  },
  emptyGreyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.transparent,
    width: '90%',
    marginTop: getVerticalScale(5),
    // marginEnd: getMScale(40),
  },
};

export default MyTextInput;
