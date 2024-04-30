import React, {useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform, Share} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import RText from '../../components/RText';
import {constants, strings} from '../../constants';
import {colors} from '../../theme';
import {displayToast} from '../../helpers/toast';
import useProviderSelector from '../../hooks/reduxStateHooks/useProviderSelector';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import {Screen} from '../../components/Screen';
import {getMScale} from '../../theme/metrics';
import InviteFriendsIcon from '../../assets/svgs/InviteFriendsIcon';
import RButton from '../../components/RButton';
import InputField from '../../components/InputField';
import Config from 'react-native-config';
import {isIos} from '../../utils/sharedUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const InviteFriends = () => {
  const {user: {referral_code = ''} = {}} = useProviderSelector();
  const pattern = /([A-Za-z]{4})([A-Za-z]{2})(\d{4})/;
  const maskedString = referral_code?.replace(pattern, '$1-$2-$3');

  const linkElement = Config.REACT_APP_RUBIOS_REWARD_ADDRESS;
  const url = linkElement;
  const title = "Use My Rubio's Rewards Invite Code and Save $5!";
  const message = `Join Rubio's Rewards at ${linkElement} and use my code ${referral_code} to get $5 off your next order!`;

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'refer_a_friend_screen',
    });
  }, []);
  const options = {
    title,
    url,
    message,
  };

  const share = async () => {
    await Share.share(options);
  };
  const copyToClipboard = () => {
    referral_code && Clipboard.setString(referral_code);
    displayToast('SUCCESS', 'Invite Code Copied To ClipBoard');
    logFirebaseCustomEvent(strings.click, {
      click_label: 'copy',
      click_destination: 'Copy Invite Code To ClipBoard',
    });
  };

  return (
    <Screen backgroundColor={colors.white} preset={'fixed'} withHeader>
      <ScreenHeader showCartButton={false} title={'INVITE CODE'} />
      <View style={styles.inviteFriendsView}>
        <InviteFriendsIcon />
        <RText
          text={strings.invite_instructions}
          size={'xs'}
          weight={'semiBold'}
          color={colors.primary}
          textStyle={styles.inviteCodeTextStyle}
        />
        <RText
          text={strings.invite_instructions_}
          size={'xs'}
          color={colors.primary}
          textStyle={styles.inviteCodeTextStyle_}
        />

        <RButton
          accessibilityHint={
            'activate top open share modal and share invite code to your friends.'
          }
          onPress={share}
          title={strings.inviteFriends}
          disabled={false}
          click_label={strings.inviteFriends}
          click_destination={'Opens Native Share Sheet'}
          buttonStyle={styles.submitBtnStyle}
        />
      </View>

      <View style={styles.lineContainer}>
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <View style={styles.orTextContainer}>
            <RText text={'Or'} size={'xs'} color={colors.subTitleText} />
          </View>
          <View style={styles.orLine} />
        </View>
      </View>

      <RText
        text={strings.copy_your_code}
        color={colors.primary}
        size={'xs'}
        weight={'semiBold'}
        textStyle={styles.copyYourCode}
      />

      <View style={styles.inviteCodeWrapper}>
        <InputField
          value={maskedString?.toUpperCase()}
          label={'Invite Code'}
          editable={false}
          inputStyle={styles.inputStyle}
          keyboardType={constants.KEYBOARD_TYPES.PHONE_PAD}
          RightAccessoryComponent={() => (
            <TouchableOpacity
              accessible
              accessibilityHint={'activate to copy invite code to clipboard.'}
              style={{
                alignSelf: 'center',
                marginRight: getMScale(15),
              }}
              hitSlop={{left: 300, right: 10, top: 20, bottom: 20}}
              onPress={copyToClipboard}>
              <RText text={'Copy'} color={colors.primaryLink} textStyle={{alignSelf: 'center'}} />
            </TouchableOpacity>
          )}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteFriendsView: {
    paddingVertical: getMScale(16),
    // height: getMScale(271),
    width: '90%',
    marginHorizontal: getMScale(16),
    // justifyContent:'center',
    marginTop: isIos ? getMScale(5) : getMScale(16),
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(162, 162, 162, 0.3)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  submitBtnStyle: {
    width: '60%',
    alignSelf: 'center',
    marginTop: getMScale(16),
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
  headerText: {
    fontWeight: 'bold',
  },
  textWrapper: {
    padding: 20,
    backgroundColor: colors.white,
    marginTop: 30,
  },
  inviteTextStyle: {
    fontSize: 18,
    paddingTop: 20,
  },
  referralCodeStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 20,
  },

  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: getMScale(16),
    marginTop: getMScale(30),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary_23,
  },
  orTextContainer: {
    paddingHorizontal: 8,
  },
  inviteCodeWrapper: {
    marginHorizontal: getMScale(16),
    marginTop: getMScale(15),
  },
  inviteCodeTextStyle: {
    margin: getMScale(16),
    lineHeight: 17.5,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  inviteCodeTextStyle_: {
    lineHeight: 17.5,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  copyYourCode: {
    lineHeight: 17.5,
    letterSpacing: 0.15,
    textAlign: 'center',
    marginTop: getMScale(35),
  },
  inputStyle: {
    color: colors.primary,
    fontSize: getMScale(16),
    letterSpacing: 0.15,
    width: getMScale(200),
  },
  recieveInstructionsTextStyle: {
    lineHeight: 17.5,
    letterSpacing: 0.15,
    marginTop: getMScale(25),
    marginHorizontal: getMScale(30),
    textAlign: 'center',
  },
});

export default InviteFriends;
