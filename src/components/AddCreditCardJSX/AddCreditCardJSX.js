import {AccessibilityInfo, findNodeHandle, Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import RText from '../RText';
import {strings} from '../../constants';
import useAddCreditCard, {INPUTS} from './useAddCreditCard';
import InputField from '../InputField';
import RButton from '../RButton';
import styles from './styles';
import WebView from 'react-native-webview';
import {createRef, useEffect, useRef} from 'react';
import {colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomSheetHeader from '../BottomSheetHeader/BottomSheetHeader';
import CheckBox from '../CheckBox/CheckBox';
import Config from 'react-native-config';
import {logToConsole} from "../../configs";

// const LocalIframe = require('../../creditCardIframe-dev.html');
export const webViewRef = createRef();
const AddCreditCardJSX = ({
  onClose,
  isEditing,
  onOrderSuccess,
  onOrderFailure,
  containerStyle,
  onIframeReady,
    accessible
}) => {
  const {
    inputState,
    inputError,
    basketId,
    handleInputChange,
    onSubmitCreditCard,
    onBridgeMessage,
    isGuest,
    saveCreditCard,
    onChangeCheckBox,
      payment_script,
  } = useAddCreditCard({
    onClose,
    isEditing,
    onOrderSuccess,
    onOrderFailure,
    onIframeReady,
  });

  const parentViewRef = useRef();
  useEffect(() => {
      if (accessible) {
          const reactTag = findNodeHandle(parentViewRef.current);
          AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
  }, [accessible]);

  const renderInputs = () => {
    return INPUTS.map(item => {
      const {key, isIframe, placeHolder = '', ...rest} = item || {};
      return (
        <View>
          <RText
            text={placeHolder}
            color={colors.black}
            size={'xs'}
            textStyle={{marginVertical: 7}}
          />
          <InputField
            key={key}
            value={inputState[key]}
            containerStyle={{
              height: 56,
              borderWidth: 0,
              borderRadius: 0,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.17,
              shadowRadius: 2.54,
              elevation: 3,
            }}
            error={inputError[key]}
            onChangeText={text => handleInputChange(text, key)}
            {...rest}
          />
        </View>
      );
    });
  };

  return (
    <TouchableWithoutFeedback
        accessible={false}
        style={[styles.container, containerStyle]} onPress={Keyboard.dismiss}>
      <View accessible={accessible} style={{height: '100%'}}>
        <BottomSheetHeader
            ref={parentViewRef}
            accessibilityRole={'adjustable'}
            accessibilityLabel={'Bottom sheet'}
            title={global.isEditingCard ? strings.edit_credit_card : strings.add_a_card}
          onClose={onClose}
        />
        <KeyboardAwareScrollView style={{flex: 1}} extraHeight={50} extraScrollHeight={50}>
          <View
            renderToHardwareTextureAndroid={true}
            style={{height: getMScale(210), paddingHorizontal: 10}}>
            <WebView
              source={{uri: payment_script}}
              //   source={LocalIframe}
              injectedJavaScript={`
                document.getElementById('basketId').value="${basketId}"
                document.getElementById('brandAccessId').value="${Config.REACT_APP_BRAND_ACCESS_ID}"
                true;
              `}
              onError={e => logToConsole({onError: e})}
              onHttpError={e => logToConsole({onHttpError: e})}
              ref={webViewRef}
              originWhitelist={['*']}
              automaticallyAdjustContentInsets={true}
              bounces={false}
              cacheEnabled={false}
              androidHardwareAccelerationDisabled={true}
              nestedScrollEnabled
              javaScriptEnabled
              onMessage={onBridgeMessage}
            />
          </View>
          <View style={{paddingHorizontal: 20}}>{renderInputs()}</View>
          {!isGuest ? (
            <CheckBox
              text={'Save payment information for faster reordering'}
              style={{marginStart: getMScale(20), marginTop: getMScale(10)}}
              checked={saveCreditCard}
              height={16}
              width={16}
              onValueChange={onChangeCheckBox}
            />
          ) : null}
          <View
            style={{
              marginTop: getVerticalScale(16),
              width: '90%',
              height: 1,
              backgroundColor: colors.primary_23,
              alignSelf: 'center',
            }}
          />
          <View style={styles.buttonContainer}>
            <RButton
              buttonStyle={styles.button}
              title={isEditing ? strings.update_credit_card : strings.done}
              onPress={onSubmitCreditCard}
              accessibilityHint={'activate to add credit card'}
              // titleStyle={styles.buttonTitleStyle}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default AddCreditCardJSX;
