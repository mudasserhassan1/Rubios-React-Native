import React, {useRef} from 'react';
import {Keyboard, Linking, ScrollView, TouchableOpacity, View} from 'react-native';
import {constants, screens, strings} from '../../constants';
import InputField from '../../components/InputField';
import RButton from '../../components/RButton';
import styles from './styles';
import RText from '../../components/RText';
import useProfileHook from './useProfileHook';
import {colors} from '../../theme';
import {Screen} from '../../components/Screen';
import {formatDateTime} from '../../utils/timeUtils';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import CheckBox from '../../components/UtensilCheckBox';
import {getMScale} from '../../theme/metrics';
import MyTextInput from '../../components/TextInputProfile';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import CheckIconActive from '../../assets/svgs/CheckIconActive';
import CheckIcon from '../../assets/svgs/CheckIcon';
import {KEYBOARD_BEHAVIOR} from '@gorhom/bottom-sheet';
import ConfirmationCodeInput from '../../components/ConfirmationCodeInput';
import LoadingOverlay from '../../components/LoadingComponent/SpinnerOverly';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {formatWithMask} from 'react-native-mask-input';
import useFirebaseConfigSelector from "../../hooks/reduxStateHooks/useFirebaseConfigSelector";

const ProfileScreen = () => {
  const {
    INPUT_KEYS,
    firstName,
    lastName,
    email,
    mobile,
    birthday,
    currenntPassword,
    password,
    confirmPassword,
    emailError,
    currenntPasswordError,
    passwordError,
    confirmPasswordError,
    firstNameError,
    errorLastName,
    mobileError,
    inputsRef,
    handelFirstNameChange,
    handelLastNameChange,
    handelEmailChange,
    handelPhoneChange,
    handleCurrentPassword,
    handelPasswordChange,
    handelConfirmPasswordChange,
    onEmailTogglePress,
    onPNToggle,
    isEmailNotificationToggleOn,
    userDataLoading,
    isPNSubscribed,
    onConsent,
    onPasswordTap,
    onPhoneTap,
    changePasswordBottomSheetRef,
    changeMobileNumberBottomSheetRef,
    snapPoints,
    headerTitle,
    handleCrossBtn,
    phoneNumberSnapPoints,
    onSubmitEditing,
    checkIfDataUpdated,
    isValidUSMobileNumber,
    isPasswordCriteriaMet,
    isPhoneCriteriaMet,
    onPhoneVerifyTap,
    isKeyboardOpen,
    phoneNumberSnapPoints_,
    showOTPView,
    verificationCodeError,
    setVerificationCodeError,
    code,
    setCode,
    onOTPVerify,
    onPasswordUpdateBtn,
    onChangePasswordUpdate,
    otpLoader,
    isSameNumber,
    deleteAccountLoading,
    isFBUser,
    appleUser,
    isEmailToggleLoading,
    isPNToggleLoading,
  } = useProfileHook();

  const {terms_and_conditions_url, privacy_policy_url} = useFirebaseConfigSelector();

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const {masked: maskedPhone} = formatWithMask({
    text: mobile,
    mask: constants.MASKS.PHONE_MASK,
  });

  const renderContent = () => {
    return (
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{paddingBottom: getMScale(50)}}
        style={{
          paddingHorizontal: getMScale(16),
          backgroundColor: colors.white,
        }}>
        <View>
          <MyTextInput
            ref={inputsRef.current[INPUT_KEYS.FIRST_NAME]}
            label={'First Name'}
            key={INPUT_KEYS.FIRST_NAME}
            maxLength={30}
            placeholder={strings.enter_first_name}
            value={firstName}
            onChangeText={handelFirstNameChange}
            error={firstNameError}
            blurOnSubmit={true}
            returnKeyType={'done'}
            hideOnBlur={true}
            onSubmitEditing={checkIfDataUpdated}
          />

          <MyTextInput
            label={'Last Name'}
            key={INPUT_KEYS.LAST_NAME}
            ref={inputsRef.current[INPUT_KEYS.LAST_NAME]}
            placeholder={strings.enter_last_name}
            value={lastName}
            onChangeText={handelLastNameChange}
            maxLength={30}
            error={errorLastName}
            blurOnSubmit={true}
            hideOnBlur={true}
            returnKeyType={'done'}
            onSubmitEditing={checkIfDataUpdated}
          />
          <MyTextInput
            label={'Email'}
            key={INPUT_KEYS.EMAIL}
            ref={inputsRef.current[INPUT_KEYS.EMAIL]}
            placeholder={strings.enter_email}
            value={email}
            onChangeText={handelEmailChange}
            keyboardType={constants.KEYBOARD_TYPES.EMAIL_ADDRESS}
            blurOnSubmit={true}
            hideOnBlur={true}
            returnKeyType={'done'}
            autoCapitalize={'none'}
            error={emailError}
            onSubmitEditing={checkIfDataUpdated}
            // disabled={isFBUser || appleUser}
            // editable={!(isFBUser || appleUser)}
            disabled={true}
            editable={false}
          />
        </View>
        <MyTextInput
          key={INPUT_KEYS.CURRENT_PASSWORD}
          ref={inputsRef.current[INPUT_KEYS[INPUT_KEYS.CURRENT_PASSWORD]]}
          label={'Password'}
          onPasswordTap={onPasswordTap}
          placeholder={'********'}
          value={'********'}
          editable={false}
          disabled={isFBUser || appleUser}
        />
        <MyTextInput
          label={'Phone'}
          placeholder={'Enter Your Phone Number'}
          value={maskedPhone}
          editable={false}
          onPhoneTap={onPhoneTap}
          disabled={isFBUser || appleUser}
        />
        <MyTextInput
          key={INPUT_KEYS.BIRTHDAY}
          label={'Birthday'}
          editable={false}
          placeholder={'--/--/--'}
          value={birthday ? formatDateTime(birthday, 'MM/DD/YYYY') : ''}
          disabled
        />
        <View style={styles.greyHorizontalLineStyle} />

        <View>
          <RText
            text={'Communications'}
            color={colors.primary}
            size={'md'}
            weight={'semiBold'}
            textStyle={styles.communicationTextStyle}
          />
          <RText
            textStyle={styles.subText}
            text={strings.communication_copy}
            size={'xxs'}
            color={colors.subTitleText}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: getMScale(10),
          }}>
          <View>
            <RText
              text={'Via Email'}
              color={colors.primary}
              size={'xs'}
              textStyle={styles.viaEmailTextStyle}
            />
            <RText
              text={'Via Push Notification'}
              color={colors.primary}
              size={'xs'}
              textStyle={styles.viaPNTextStyle}
            />
            {/*<RText*/}
            {/*  text={'Via Text Messages'}*/}
            {/*  color={colors.primary}*/}
            {/*  size={'xs'}*/}
            {/*  textStyle={styles.viaPNTextStyle}*/}
            {/*/>*/}
          </View>
          <View>
            <CheckBox
              height={20}
              width={20}
              checked={isEmailNotificationToggleOn}
              onValueChange={onEmailTogglePress}
              loading={isEmailToggleLoading}
            />
            <View style={{marginTop: getMScale(6)}}>
              <CheckBox
                height={20}
                width={20}
                checked={isPNSubscribed}
                onValueChange={onPNToggle}
                loading={isPNToggleLoading}
              />
            </View>
            {/*<View style={{marginTop: getMScale(6)}}>*/}
            {/*  <CheckBox*/}
            {/*    height={20}*/}
            {/*    width={20}*/}
            {/*    checked={isSMSSubscribed}*/}
            {/*    onValueChange={onSMSToggle}*/}
            {/*  />*/}
            {/*</View>*/}
          </View>
        </View>

        <View style={styles.greyHorizontalLineStyle} />

        <View>
          <RText text={'Permissions'} color={colors.primary} size={'md'} weight={'semiBold'} />
          <RText textStyle={styles.subText}>
            To adjust permissions for location sharing, notifications and Faceid, please go to your
            <RText onPress={openPermissionSettings} textStyle={styles.systemText}>
              {' '}
              System Settings.
            </RText>
          </RText>
        </View>

        {/*<View*/}
        {/*  style={{*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*    alignItems: 'center',*/}
        {/*    marginBottom: getMScale(10),*/}
        {/*  }}>*/}
        {/*  <View>*/}
        {/*    <RText*/}
        {/*      text={'Location Sharing'}*/}
        {/*      color={colors.primary}*/}
        {/*      size={'xs'}*/}
        {/*      textStyle={styles.viaEmailTextStyle}*/}
        {/*    />*/}
        {/*    <RText*/}
        {/*      text={'Notifications'}*/}
        {/*      color={colors.primary}*/}
        {/*      size={'xs'}*/}
        {/*      textStyle={styles.viaPNTextStyle}*/}
        {/*    />*/}
        {/*    <RText*/}
        {/*      text={'Face ID'}*/}
        {/*      color={colors.primary}*/}
        {/*      size={'xs'}*/}
        {/*      textStyle={styles.viaPNTextStyle}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*  <View>*/}
        {/*    <CheckBox*/}
        {/*      height={20}*/}
        {/*      width={20}*/}
        {/*      checked={isLocationSharingToggleOn}*/}
        {/*      // onValueChange={onLOcationSharingToggle}*/}
        {/*    />*/}
        {/*    <View style={{marginTop: getMScale(6)}}>*/}
        {/*      <CheckBox*/}
        {/*        height={20}*/}
        {/*        width={20}*/}
        {/*        checked={isPushNotificationToggleOn}*/}
        {/*        // onValueChange={onPushNotificationTogglePress}*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*    <View style={{marginTop: getMScale(6)}}>*/}
        {/*      <CheckBox*/}
        {/*        height={20}*/}
        {/*        width={20}*/}
        {/*        checked={isFaceIdToggleOn}*/}
        {/*        // onValueChange={onFaceIdToggle}*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}

        <View style={styles.greyHorizontalLineStyle} />
        <TouchableOpacity
          accessible
          accessibilityHint={'activate to open privacy policy'}
          onPress={onPrivacyPolicyTap}>
          <RText
            text={'Privacy Policy'}
            color={colors.primary}
            size={'xxs'}
            weight={'semiBold'}
            textStyle={styles.privacyPolicyText}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: getMScale(10),
          }}>
          <TouchableOpacity
            accessible
            accessibilityHint={'activate to open terms & conditions'}
            onPress={onTermOfUsePress}>
            <RText
              text={'Terms and Conditions'}
              color={colors.primary}
              size={'xxs'}
              weight={'semiBold'}
              textStyle={styles.privacyPolicyText}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.greyHorizontalLineStyle} />
        <TouchableOpacity
          accessible
          accessibilityHint={'activate to delete your account.'}
          onPress={onConsent}>
          <RText
            text={'Delete Account'}
            color={colors.red}
            size={'xxs'}
            weight={'semiBold'}
            textStyle={styles.deleteAccount}
          />
        </TouchableOpacity>
      </ScrollView>
    );
  };
  const renderChangePasswordBottomSheet = () => {
    return (
      <BottomSheetModalComponent
        ref={changePasswordBottomSheetRef}
        snapPoints={snapPoints}
        snapIndex={0}
        handleComponent={null}
        animationDuration={300}
        keyboardBehavior={KEYBOARD_BEHAVIOR.interactive}
        hideHandleBar={true}>
        {renderHeaderView()}
        {renderPasswordFields()}
      </BottomSheetModalComponent>
    );
  };

  const renderHeaderView = () => {
    return (
      <View style={styles.timeSlotHeader}>
        <View style={styles.nullHeaderIcon} />
        <RText
          text={headerTitle}
          textStyle={{textTransform: 'uppercase'}}
          size={'lg'}
          weight={'headerBold'}
        />
        <TouchableOpacity
          accessible
          accessibilityHint={'activate to close this modal.'}
          onPress={handleCrossBtn}
          activeOpacity={0.7}
          disabled={userDataLoading}
          style={styles.headerIconBackground}>
          <ImageComponent source={images.header_cross} style={styles.headerCrossIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPasswordFields = () => {
    return (
      <View style={styles.passwordFieldsWrapper}>
        <RText
          text={strings.passwordInstructions}
          color={colors.subTitleText}
          size={'xs'}
          textStyle={styles.pawordInstructionsTextStyle}
        />
        <InputField
          key={INPUT_KEYS.CURRENT_PASSWORD}
          isBottomSheetInput
          ref={currentPasswordRef}
          placeholder={strings.enter_current_password}
          value={currenntPassword}
          label={'Current Password'}
          onChangeText={handleCurrentPassword}
          blurOnSubmit={false}
          isPasswordInput
          textContentType={'password'}
          error={currenntPasswordError}
          onSubmitEditing={() => newPasswordRef?.current?.focus()}
        />
        <InputField
          key={INPUT_KEYS.NEW_PASSWORD}
          isBottomSheetInput
          ref={newPasswordRef}
          placeholder={strings.enter_new_password}
          value={password}
          label={'New Password'}
          onChangeText={handelPasswordChange}
          blurOnSubmit={false}
          isPasswordInput
          textContentType={'password'}
          error={passwordError}
          onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
        />
        <InputField
          key={INPUT_KEYS.CONFIRM_PASSWORD}
          ref={confirmPasswordRef}
          placeholder={strings.enter_confirm_password}
          isBottomSheetInput
          value={confirmPassword}
          label={'Confirm Password'}
          onSubmitEditing={onChangePasswordUpdate}
          isPasswordInput
          onChangeText={handelConfirmPasswordChange}
          returnKeyType={'done'}
          textContentType={'password'}
          error={confirmPasswordError}
        />

        <RButton
          accessibilityHint={'activate to update password.'}
          onPress={onChangePasswordUpdate}
          title={strings.complete}
          disabled={!isPasswordCriteriaMet || userDataLoading}
          loading={userDataLoading}
          click_label={strings.complete}
          click_destination={screens.PROFILE}
          buttonStyle={styles.submitBtnStyle}
        />
      </View>
    );
  };
  const renderPhoneNumberBottomSheet = () => {
    return (
      <BottomSheetModalComponent
        ref={changeMobileNumberBottomSheetRef}
        snapPoints={isKeyboardOpen ? phoneNumberSnapPoints_ : phoneNumberSnapPoints}
        snapIndex={0}
        hideHandleBar={true}>
        {renderHeaderView()}
        {!showOTPView ? renderPhoneField() : null}
        {showOTPView ? renderCodeInput() : null}
      </BottomSheetModalComponent>
    );
  };
  const renderPhoneField = () => {
    return (
      <View style={styles.passwordFieldsWrapper}>
        <RText
          text={strings.phonenumberInstructions}
          color={colors.subTitleText}
          size={'xs'}
          textStyle={styles.pawordInstructionsTextStyle}
        />
        <InputField
          isMaskedInput
          isBottomSheetInput
          key={INPUT_KEYS.PHONE}
          ref={inputsRef.current[INPUT_KEYS[INPUT_KEYS.PHONE]]}
          placeholder={strings.mobile_phone}
          value={mobile}
          label={'Mobile Number'}
          maxLength={14}
          keyboardType={constants.KEYBOARD_TYPES.PHONE_PAD}
          mask={constants.MASKS.PHONE_MASK}
          onChangeText={handelPhoneChange}
          error={mobileError}
          onSubmitEditing={() => onSubmitEditing(INPUT_KEYS.PHONE)}
          RightAccessoryComponent={() => (
            <View style={{alignSelf: 'center', marginEnd: getMScale(15)}}>
              {isValidUSMobileNumber && isPhoneCriteriaMet ? <CheckIconActive /> : <CheckIcon />}
            </View>
          )}
          returnKeyType={'done'}
          hideOnBlur={false}
        />
        <RButton
          accessibilityHint={'activate to send otp on your phone number.'}
          onPress={onPhoneVerifyTap}
          title={strings.verify}
          click_label={strings.verify}
          click_destination={'Open OPT Input Modal Sheet'}
          disabled={!isPhoneCriteriaMet || userDataLoading || otpLoader || isSameNumber}
          loading={userDataLoading || otpLoader}
          buttonStyle={styles.submitBtnStyle}
        />
      </View>
    );
  };

  const getParsedPhoneNumber = () => {
    const number = mobile || '';
    const unmasked = `+1${number?.replace(/\D/g, '')}`;
    if (unmasked.length >= 10) {
      const firstThree = unmasked?.slice(0, 2);
      const lastFour = unmasked?.slice(unmasked.length - 4, unmasked.length);
      return `${firstThree} XXX XXX ${lastFour}`;
    }
    return number;
  };

  const renderCodeInput = () => {
    return (
      <View>
        <View style={styles.otpInstructionsTextStyle}>
          <RText color={colors.subTitleText} size={'xs'} textStyle={{lineHeight: 17.5}}>
            {'Complete editing your number  by verifying the OTP sent to '}
            <RText
              text={`${getParsedPhoneNumber()}`}
              weight={'semiBold'}
              size={'xs'}
              textStyle={{lineHeight: 17.5}}
            />
          </RText>
        </View>

        <ConfirmationCodeInput
          errorMessage={verificationCodeError}
          cellCount={4}
          value={code}
          containerStyle={{marginTop: getMScale(25), marginHorizontal: getMScale(50)}}
          setValue={value => {
            setVerificationCodeError('');
            setCode(value);
          }}
        />
        <RText
          text={verificationCodeError}
          size={'xxs'}
          color={colors.error}
          textStyle={{marginTop: getMScale(20), marginStart: getMScale(50)}}
        />
        <RButton
          accessibilityHint={'activate to verify otp you entered.'}
          onPress={onOTPVerify}
          title={strings.complete}
          disabled={code?.length !== 4 || otpLoader || verificationCodeError?.length > 0}
          click_label={strings.complete}
          click_destination={screens.PROFILE}
          loading={userDataLoading || otpLoader}
          buttonStyle={styles.completeBtnStyle}
        />
      </View>
    );
  };
  const onPrivacyPolicyTap = () => {
    Keyboard?.dismiss();
    Linking?.canOpenURL(privacy_policy_url).then(supported => {
      if (supported) {
        logFirebaseCustomEvent(strings.click, {
          click_label: 'terms_of_use',
          click_destination: 'Open Terms Of Use URL in browser',
        });
        Linking?.openURL(privacy_policy_url);
      }
    });
  };
  const onTermOfUsePress = () => {
    Keyboard?.dismiss();
    Linking?.canOpenURL(terms_and_conditions_url).then(supported => {
      if (supported) {
        logFirebaseCustomEvent(strings.click, {
          click_label: 'privacy_policy',
          click_destination: 'Open Privacy Policy URL in browser',
        });
        Linking?.openURL(terms_and_conditions_url);
      }
    });
  };
  const openPermissionSettings = () => {
    Keyboard?.dismiss();
    Linking.openSettings();
    logFirebaseCustomEvent(strings.click, {
      click_label: 'permission_settings',
      click_destination: 'Open Settings in OS',
    });
  };
  return (
    <>
      <Screen preset={'fixed'} withHeader>
        <ScreenHeader showCartButton={false} title={'MY PROFILE'} />
        {renderContent()}
        {renderChangePasswordBottomSheet()}
        {renderPhoneNumberBottomSheet()}
      </Screen>
      <LoadingOverlay isLoading={deleteAccountLoading} />
    </>
  );
};

export default ProfileScreen;
