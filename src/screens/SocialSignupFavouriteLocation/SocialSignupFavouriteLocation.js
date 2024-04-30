import {colors} from '../../theme';
import RText from '../../components/RText';
import {strings} from '../../constants';
import {getVerticalScale} from '../../theme/metrics';
import {View} from 'react-native';
import {Screen} from '../../components/Screen';
import React, {useEffect} from 'react';
import useSignup from '../../hooks/useSignup';
import {useNavigation} from '@react-navigation/native';

const SocialSignupFavouriteLocation = () => {
  const {
    renderBirthdayInput,
    renderFavLocationView,
    renderInviteCodeView,
    renderLocationModalJSX,
    renderDOBPicker,
    renderSignupButtonJSX,
  } = useSignup({registerType: 'REGISTER_MAIN'});

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setParams({activeStep: 3});
    navigation.setOptions({headerTitle: 'Complete'});
  }, [navigation]);

  const renderHorizontalLine = () => (
    <View style={{height: 1, backgroundColor: '#E7E7E7', marginVertical: getVerticalScale(7)}} />
  );

  return (
    <Screen
      // loading={isButtonLoading}
      backgroundColor={colors.white}
      withHeader
      preset={'scroll'}
      style={{flex: 1, paddingHorizontal: 15}}>
      <RText
        text={strings.birthday_rewards}
        weight={'semiBold'}
        size={'md'}
        textStyle={{marginVertical: getVerticalScale(5)}}
      />
      <RText
        text={strings.birthday_instructions}
        color={colors.subTitleText}
        size={'xs'}
        textStyle={{marginVertical: getVerticalScale(5)}}
      />
      {renderBirthdayInput()}
      {renderDOBPicker()}
      {renderHorizontalLine()}
      {renderFavLocationView()}
      {renderHorizontalLine()}
      {renderInviteCodeView()}
      {renderLocationModalJSX()}
      <View style={{marginVertical: getVerticalScale(20)}}>{renderSignupButtonJSX()}</View>
    </Screen>
  );
};
export default SocialSignupFavouriteLocation;
