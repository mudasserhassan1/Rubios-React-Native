import React, {useEffect} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';

import {constants, screens, strings} from '../../constants';
import {colors} from '../../theme';
import styles from './styles';
import RText from '../../components/RText';
import {images} from '../../assets';
import RButton from '../../components/RButton';
import {useNavigation} from '@react-navigation/native';
import {guestUserLogin} from '../../redux/actions/user';
import {resetBasketRequest} from '../../redux/actions/basket';
import {useDispatch} from 'react-redux';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const LastOnboardingScreen = () => {
  const {LastOnBoardingButtons = []} = constants || {};
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'last_boarding_screen',
    });
  }, []);
  const onButtonPress = async actionKey => {
    // const token = await messaging().getToken();
    // dispatch(getFcmTokenSuccess(token));
    // logToConsole({token});
    switch (actionKey) {
      case 'login':
        logFirebaseCustomEvent(strings.click, {
          click_label: 'login',
          click_destination: 'Login Screen',
        });
        navigation.reset({
          index: 0,
          routes: [{name: screens.SIGN_IN}],
        });
        break;
      case 'signup':
        logFirebaseCustomEvent(strings.click, {
          click_label: 'sign_up',
          click_destination: 'SignUp Screen',
        });
        navigation.navigate(screens.SIGNUP);
        break;
      case 'orderNow':
        logFirebaseCustomEvent(strings.click, {
          click_label: 'continue_as_guest',
          click_destination: 'Home Screen',
        });
        dispatch(guestUserLogin());
        return dispatch(resetBasketRequest());
      // dispatch(setIsOnBoarded(true));
      default:
        break;
    }
  };
  return (
    <ImageBackground source={images.onBoarding5} style={styles.imageBackground} resizeMode="cover">
      <View
        style={{
          marginTop: getVerticalScale(120),
          width: getMScale(300),
          alignSelf: 'center',
          paddingBottom: getVerticalScale(25),
        }}>
        <RText
          accessible
          accessibilityRole={'header'}
          text={'EARN YOUR FREE TACOS'}
          size={'xxl'}
          weight={'headerBold'}
          numberOfLines={2}
          textStyle={styles.titleStyle}
        />
        <RText
          accessible
          text={'Earn points and enjoy a welcome offer when you join Rewards.'}
          color={colors.black}
          textStyle={styles.subTitleStyle}
        />
      </View>

      {LastOnBoardingButtons.map(item => {
        const {title, key, style = {}, titleStyle = {}} = item || {};
        return (
          <View
            key={key}
            style={{
              alignSelf: 'center',
              marginTop: getVerticalScale(15),
            }}>
            <RButton
              accessible
              accessibilityHint={
                key === 'login'
                  ? 'activate to open login screen'
                  : key === 'signup'
                  ? 'activate to open sign up screen'
                  : ''
              }
              title={title}
              buttonStyle={{
                width: getMScale(230),
                height: getVerticalScale(44),
                padding: getMScale(6),
                marginVertical: getVerticalScale(1),
                backgroundColor: colors.secondary,
                borderRadius: 23,
                ...style,
              }}
              onPress={() => onButtonPress(key)}
              titleStyle={{color: colors.white, textTransform: 'uppercase', ...titleStyle}}
              titlePreset={'label'}
            />
          </View>
        );
      })}
      <TouchableOpacity
        accessible
        accessibilityHint={'activate to continue as a guest'}
        onPress={() => onButtonPress('orderNow')}>
        <RText
          text={strings.continue_as_guest}
          color={colors.primary}
          textStyle={{
            alignSelf: 'center',
            marginTop: getMScale(16),
            textDecorationLine: 'underline',
          }}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default LastOnboardingScreen;
