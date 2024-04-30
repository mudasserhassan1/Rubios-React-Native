import {ScrollView, StyleSheet, View} from 'react-native';
import RText from '../RText';
import {colors} from '../../theme';
import RButton from '../RButton';
import {screens, strings} from '../../constants';
import React from 'react';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {useNavigation} from '@react-navigation/native';
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
const GuestBottomSheetBody = ({
  TitleImage,
  title,
  description,
  shadowImage = false,
  closeBottomSheet,
  closeSideMenu,
}) => {
  const navigation = useNavigation();

  const handleAuthNavigator = screen => {
    closeBottomSheet?.();
    closeSideMenu?.();
    setTimeout(() => {
      navigation.navigate('AuthStack', {screen});
      // dispatch(removeGuestLogin);
    }, 300);
  };
  // };
  return (
    <BottomSheetScrollView style={styles.contentContainer} contentContainerStyle={{alignItems: 'center', flexGrow: 1, paddingBottom: 30}}>
      <View style={shadowImage ? styles.shadowContainer : styles.modalTopImageStyle}>
        <TitleImage />
      </View>
      <RText
        text={title}
        color={colors.primary}
        weight={'headerBold'}
        size={'lg'}
        textStyle={styles.titleTextStyle}
      />
      <RText
        text={description}
        color={colors.primary}
        weight={'regular'}
        size={'sm'}
        textStyle={styles.descriptionText}
      />
      <RButton
        accessibilityHint={'activate to open Sign up screen'}
        onPress={() => handleAuthNavigator(screens.SIGNUP)}
        title={strings.create_an_account}
        disabled={false}
        buttonStyle={styles.createAccountBtn}
      />
      <RText
        accessible
        accessibilityHint={'activate to open login screen'}
        textStyle={styles.signupText}>
        <RText text={`${strings.already_a_member}  `} />
        <RText
          text={strings.login_}
          color={colors.primaryLink}
          onPress={() => handleAuthNavigator(screens.SIGN_IN)}
        />
      </RText>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 50,
  },
  modalTopImageStyle: {
    marginTop: getMScale(20),
    backgroundColor: colors.white,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowContainer: {
    borderRadius: 60,
    backgroundColor: colors.white,
    width: 115,
    marginTop: 10,
    height: 115,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 5, // This property is for Android devices
  },
  titleTextStyle: {
    marginTop: getMScale(24),
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 24,
  },
  descriptionText: {
    marginTop: getMScale(16),
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  createAccountBtn: {width: '85%', marginTop: getVerticalScale(32)},
  signupText: {marginTop: getMScale(24)},
  creatAccountTextStyle: {marginLeft: getMScale(11), color: colors.secondary},
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.2,
  },
});
export default React.memo(GuestBottomSheetBody);
