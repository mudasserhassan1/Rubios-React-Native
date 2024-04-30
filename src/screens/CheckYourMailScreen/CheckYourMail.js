import {Screen} from '../../components/Screen';
import RText from '../../components/RText';
import {BackHandler, StyleSheet, View} from 'react-native';
import {useRef, useState} from 'react';
import {resetAndNavigate} from '../../utils/navigationUtils';
import {screens, strings} from '../../constants';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import React from 'react';
import {colors} from '../../theme';
import RButton from '../../components/RButton';
import Timer from '../../components/Timer';
import {getMScale} from '../../theme/metrics';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import {openInbox} from 'react-native-email-link';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {userForgotPasswordRequest} from '../../redux/actions/user';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';

const CheckYourMail = () => {
  const [timeFinished, setTimeFinished] = useState(false);
  const timerRef = useRef();
  const route = useRoute();
  const {userDataLoading} = useUserSelector();

  const {email} = route.params;
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, []),
  );

  const handleOnOpenInboxPress = async () => {
    try {
      await openInbox();
    } catch (e) {}
  };

  const handleResendPress = () => {
    dispatch(userForgotPasswordRequest({email}));
    setTimeFinished(false);
    timerRef?.current?.handleRestart();
  };

  const renderTimerJSX = () => {
    return (
      <View style={styles.timerView}>
        {timeFinished ? (
          <RText
            text={strings.resend_email}
            color={colors.primaryLink}
            onPress={handleResendPress}
            textStyle={styles.timerTextStyle}
          />
        ) : (
          <>
            <RText text={strings.resend_email_in} />
            <Timer
              ref={timerRef}
              containerStyle={styles.timerContainer}
              onComplete={val => {
                setTimeFinished(val);
              }}
            />
          </>
        )}
      </View>
    );
  };

  return (
    <Screen
      style={styles.screen}
      loading={userDataLoading}
      withHeader={false}
      backgroundColor={colors.white}>
      <ScreenHeader
        title={strings.back_to_login}
        containerStyle={styles.headerContainer}
        titleStyle={styles.headerTitle}
        backArrowStyle={styles.headerArrow}
        underlined={false}
        onBackPress={() => resetAndNavigate(screens.SIGN_IN, 0)}
      />
      <View style={styles.imageContainer}>
        <ImageComponent source={images.ellipse} style={styles.ellipseImage} />
        <ImageComponent source={images.email_box} style={styles.emailImage} />
      </View>
      <View style={styles.infoContainer}>
        <RText size={'xxl'} weight={'bold'} text={strings.check_your_email} />
        <RText
          text={strings.we_have_sent_instructions_to_your_mail}
          color={colors.textGray}
          textStyle={styles.emailInstructions}
        />
        <RButton
          title={strings.open_email_app}
          buttonStyle={styles.button}
          onPress={handleOnOpenInboxPress}
        />
        {renderTimerJSX()}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerContainer: {flexDirection: 'row', alignItems: 'center'},
  headerTitle: {fontSize: 16, lineHeight: 25},
  headerArrow: {marginTop: 7},
  imageContainer: {
    alignSelf: 'center',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipseImage: {width: 100, height: 100},
  emailImage: {position: 'absolute', width: 100, height: 100, start: 40, top: 120, zIndex: 1},
  infoContainer: {alignItems: 'center', paddingHorizontal: 20},
  emailInstructions: {marginVertical: 15, textAlign: 'center', width: '80%'},
  button: {width: '60%'},
  timerView: {alignSelf: 'center', marginTop: 10, flexDirection: 'row'},
  timerTextStyle: {textDecorationLine: 'underline'},
  timerContainer: {marginStart: getMScale(5)},
});
export default CheckYourMail;
