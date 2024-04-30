import React, {useEffect} from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {strings} from '../../constants';
import RText from '../../components/RText';
import useSignup from '../../hooks/useSignup';
import {colors} from '../../theme';
import {getVerticalScale} from '../../theme/metrics';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const SignupScreen = () => {
  let {
    scrollRef,
    isSocialSignup,
    renderUserInfoInputsJSX,
    renderPasswordInputsJSX,
    renderMobileNumberInput,
    renderAgreeToReceiveSms,
    renderBirthdayInput,
    renderFavLocationView,
    renderInviteCodeView,
    renderLocationModalJSX,
    renderDOBPicker,
    renderSignupButtonJSX,
    renderEmailUpdatesCheckboxJSX,
    renderTermsAndConditionsCheckboxJSX,
    renderVerificationCodeInput,
  } = useSignup({registerType: 'REGISTER_MAIN'});

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'sign_up_screen',
    });
  }, []);

  const renderHorizontalLine = () => (
    <View style={{height: 1, backgroundColor: '#E7E7E7', marginVertical: getVerticalScale(7)}} />
  );

  return (
      <KeyboardAwareScrollView
          ref={scrollRef}
          backgroundColor={colors.white}
          enableResetScrollToCoords={false}
          extraHeight={60}
          enableOnAndroid={true}
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          extraScrollHeight={60}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={{paddingBottom: 30, flexGrow: 1}}
          style={{flexGrow: 1, paddingHorizontal: 15}}>
        {renderUserInfoInputsJSX()}
        {renderHorizontalLine()}
        {renderMobileNumberInput()}
        {/*{renderAgreeToReceiveSms()}*/}
        {renderVerificationCodeInput()}
        {isSocialSignup ? null : (
            <>
              {renderHorizontalLine()}
              <RText
                  text={strings.password_instructions}
                  color={colors.subTitleText}
                  size={'xs'}
                  textStyle={{marginVertical: getVerticalScale(10)}}
              />
              {renderPasswordInputsJSX()}
            </>
        )}
        {renderHorizontalLine()}
        <RText
            text={strings.birthday_instructions}
            color={colors.textGray}
            size={'xs'}
            textStyle={{marginVertical: getVerticalScale(10)}}
        />
        {renderBirthdayInput()}
        {renderDOBPicker()}
        {renderHorizontalLine()}
        {renderFavLocationView()}
        {renderHorizontalLine()}
        {renderInviteCodeView()}
        {renderLocationModalJSX()}
        {renderTermsAndConditionsCheckboxJSX()}
        {renderEmailUpdatesCheckboxJSX()}
        {renderSignupButtonJSX()}
      </KeyboardAwareScrollView>
  );
};

export default SignupScreen;
