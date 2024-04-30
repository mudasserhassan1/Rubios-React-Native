import RText from '../../components/RText';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles';
import {
  Alert,
  BackHandler,
  ImageBackground,
  Keyboard,
  Linking,
  PermissionsAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {images} from '../../assets';
import QRCode from 'react-native-qrcode-svg';
import {colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import RoundStartIcon from '../../assets/svgs/RoundStartIcon';
import useProviderSelector from '../../hooks/reduxStateHooks/useProviderSelector';
import RButton from '../RButton';
import {constants, screens, strings} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {isIos} from '../../utils/sharedUtils';
import BottomSheetHeader from '../BottomSheetHeader/BottomSheetHeader';
import {PERMISSIONS, request} from 'react-native-permissions';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import BottomSheetModalComponent from '../BottomSheetModal/BottomSheetModalComponent';
import ImageComponent from '../ImageComponent/ImageComponent';
import InputField from '../InputField';
import {createCheckIn} from '../../redux/actions/check-in';
import {logToConsole} from '../../configs';
import {useDispatch, useSelector} from 'react-redux';
import {displayToast} from '../../helpers/toast';

const RewardsCodeBottomSheet = ({closeBottomSheet}) => {
  const {providerToken} = useProviderSelector();
  const {user = {}} = providerToken || {};
  const {user_as_qrcode = ''} = user || {};
  const navigation = useNavigation();
  const barCodeBottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['62%'], []);
  const snapPoints1 = useMemo(() => ['80%'], []);
  const [qrvalue, setBarcode] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const {singleLocation} = useSelector(state => state?.location);
  const {loading: loadingCheckIn} = useSelector(state => state.checkIn);
  const locationId = singleLocation?.data?.[0]?.location_id;
  const dispatch = useDispatch();

  useEffect(() => {
    const backAction = () => {
      closeBottomSheet?.();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [closeBottomSheet]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const askForCameraPermission = async () => {
    if (isIos) {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      if (result === 'granted') {
        navigation.navigate(screens.SCAN_RECIEPT);
      } else {
        Alert.alert('Alert', 'In order to scan receipt you need to allow camera permission.', [
          {
            text: 'Cancel',
            style: 'default',
          },
          {
            text: 'Confirm',
            style: 'default',
            onPress: () => {
              Linking?.openSettings();
            },
          },
        ]);
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate(screens.SCAN_RECIEPT);
        } else {
          Linking?.openSettings();
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };

  const handleBarCode = text => {
    setBarcode(text);
  };

  const onBarcodeScan = () => {
    if (qrvalue?.length === 13) {
      const obj = {qrvalue, locationId};
      dispatch(createCheckIn(obj, callBackStatus));
    }
  };

  const callBackStatus = (status, response) => {
    if (status === 'success') {
      displayToast('SUCCESS', `${response?.points_earned} Points Added.`);
      setBarcode('');
      barCodeBottomSheetRef?.current?.closeSheet();
    }
  };

  const renderQRCodeUI = () => {
    return (
        <BottomSheetScrollView contentContainerStyle={{paddingBottom: getMScale(50)}}>
          <ImageBackground source={images.rewardsBg} style={styles.imageBackground}>
            <View accessible accessibilityLabel={'qr code'} accessibilityRole={'image'} style={styles.qrcodeContainer}>
              <QRCode size={240} value={user_as_qrcode} />
            </View>
            <RText
                text={'Scan at register to earn points for this order!'}
                color={colors.primary}
                size={'lg'}
                weight={'bold'}
                textStyle={{
                  textAlign: 'center',
                  marginHorizontal: getMScale(70),
                  marginTop: getVerticalScale(30),
                  lineHeight: 20,
                  letterSpacing: 0.15,
                }}
            />
          </ImageBackground>
          <View style={styles.qrParent}>
            <RText
                text={'Forgot to show your QR code at register?'}
                color={colors.primary}
                size={'md'}
                weight={'semiBold'}
                textStyle={{
                  textAlign: 'center',
                  marginHorizontal: getMScale(20),
                  lineHeight: 24,
                  letterSpacing: 0.15,
                  marginTop: getMScale(25),
                }}
            />
            <RText
                text={
                  'No worries! You can still earn points for your order, just scan the QR code on your receipt or enter the code manually.'
                }
                color={colors.primary}
                size={'sm'}
                textStyle={{
                  textAlign: 'center',
                  marginHorizontal: getMScale(45),
                  lineHeight: 24,
                  letterSpacing: 0.15,
                }}
            />

            <RButton
                onPress={askForCameraPermission}
                title={strings.scan_reciept}
                click_label={strings.scan_reciept}
                click_destination={screens.SCAN_RECIEPT}
                disabled={false}
                buttonStyle={{marginTop: getVerticalScale(25), width: '85%', alignSelf: 'center'}}
            />

            <RButton
                title={'enter code manually'}
                onPress={() => barCodeBottomSheetRef?.current?.openSheet()}
                click_label={'Enter QR Code'}
                click_destination={screens.ENTER_QR_CODE}
                buttonStyle={styles.reorderButton}
                titleStyle={styles.reorderButtonTitle}
            />
          </View>
        </BottomSheetScrollView>
    );
  };
  const closeBarCodeSheet = () => {
    setBarcode('');
    barCodeBottomSheetRef?.current?.closeSheet();
  };
  const renderHeaderView = () => {
    return (
        <View style={styles.timeSlotHeader}>
          <View style={styles.nullHeaderIcon} />
          <RText
              text={'Enter code'}
              textStyle={{textTransform: 'uppercase'}}
              size={'lg'}
              weight={'headerBold'}
          />
          <TouchableOpacity
              onPress={closeBarCodeSheet}
              activeOpacity={0.7}
              style={styles.headerIconBackground}>
            <ImageComponent source={images.header_cross} style={styles.headerCrossIcon} />
          </TouchableOpacity>
        </View>
    );
  };
  const renderManualQRCodeBottomSheet = () => {
    return (
        <BottomSheetModalComponent
            ref={barCodeBottomSheetRef}
            onSheetDismiss={closeBarCodeSheet}
            snapPoints={isKeyboardOpen ? snapPoints1 : snapPoints}
            snapIndex={0}
            hideHandleBar={true}>
          {renderHeaderView()}
          <View style={styles.barCodeFieldsWrapper}>
            <RText
                text={strings.barcode_receipt_number}
                color={colors.subTitleText}
                size={'xs'}
                textStyle={styles.barCodeInstructionsTextStyle}
            />
            <InputField
                placeholder={strings.bar_code}
                value={qrvalue}
                label={'Receipt Barcode'}
                maxLength={13}
                keyboardType={constants.KEYBOARD_TYPES.PHONE_PAD}
                onChangeText={handleBarCode}
                onSubmitEditing={onBarcodeScan}
                returnKeyType={'done'}
                hideOnBlur={false}
            />
            <RButton
                onPress={onBarcodeScan}
                title={strings.verify}
                click_label={strings.verify}
                click_destination={'submit check In API call'}
                disabled={qrvalue?.length < 13}
                loading={loadingCheckIn}
                buttonStyle={styles.submitBtnStyle}
            />
          </View>
        </BottomSheetModalComponent>
    );
  };

  return (
      <>
        <BottomSheetHeader title={'My Rewards Code'} onClose={closeBottomSheet} />
        {renderQRCodeUI()}
        {renderManualQRCodeBottomSheet()}
      </>
  );
};

export default RewardsCodeBottomSheet;
