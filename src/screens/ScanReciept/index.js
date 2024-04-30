import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {CameraScreen, CameraType} from 'react-native-camera-kit';
import {colors} from '../../theme';
import {RNHoleView} from 'react-native-hole-view';
import {getMScale, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/metrics';
import ScreenHeader from './ScreenHeader';
import {useDispatch, useSelector} from 'react-redux';
import {createCheckIn} from '../../redux/actions/check-in';
import {useNavigation} from '@react-navigation/native';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';
import {displayToast} from "../../helpers/toast";

const ScanReciept = () => {
  const {singleLocation} = useSelector(state => state?.location);
  const locationId = singleLocation?.data?.[0]?.location_id;
  const [verified, setVerified] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [notVerified, setNotVerified] = useState(false);
  const [doScanBarcode, setDoScanBarcode] = useState(true);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'scan_receipt_screen',
    });
  }, []);

  const onBarcodeScan = qrvalue => {
    if (qrvalue) {
      const obj = {qrvalue, locationId};
      doScanBarcode ? dispatch(createCheckIn(obj, callBackStatus)) : null;
      setDoScanBarcode(false);
    } else {
      setNotVerified(true);
    }
  };

  const callBackStatus = (status, response) => {
    if (status === 'success') {
      setVerified(true);
      // setPointsEarned(response?.points_earned);
      displayToast('SUCCESS', `${response?.points_earned} Points Added.`);
      setTimeout(() => {
        navigation.goBack();
      }, 4000);
    } else {
      displayToast('ERROR', 'Invalid Code');
      // setNotVerified(true);
      setTimeout(() => {
        navigation.goBack();
      }, 4000);
    }
  };
  const renderScannedStatus = () => {
    return (
      <>
        {/*{verified ? (*/}
        {/*  <View style={styles.textBorder}>*/}
        {/*    <View style={styles.textSuccessStatusStyle}>*/}
        {/*      <RText text={`${pointsEarned} Points Added`} color={colors.white} />*/}
        {/*      <View style={{marginStart: getMScale(16)}}>*/}
        {/*        <WhiteTickIcon />*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*) : null}*/}
        {/*{notVerified ? (*/}
        {/*  <View style={styles.textBorder}>*/}
        {/*    <View style={styles.textErrorStatusStyle}>*/}
        {/*      <RText text={'Invalid Code'} color={colors.white} />*/}
        {/*      <View style={{marginStart: getMScale(16)}}>*/}
        {/*        <WhiteCrossIcon />*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*) : null}*/}
        {verified && <View style={styles.borderVerfied} />}
        {notVerified && <View style={styles.borderNotVerified} />}
      </>
    );
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar hidden />
      <CameraScreen
        style={StyleSheet.absoluteFill}
        hideControls
        showFrame={false}
        cameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={event => onBarcodeScan(event?.nativeEvent?.codeStringValue)}
      />
      <RNHoleView holes={[styles.rnholeViewHeight]} style={styles.rnholeView} />
      <ScreenHeader />
      {renderScannedStatus()}
    </View>
  );
};

export default ScanReciept;
const rnHoleWidth = getMScale(300);
const rnHoleHeight = getMScale(300);
const startX = SCREEN_WIDTH / 2 - rnHoleWidth / 2;
const startY = SCREEN_HEIGHT / 2 - rnHoleHeight / 2 - getMScale(100);
const borderRadiusOfCamera = 20;
const borderWithOfCamera = 3;
const styles = StyleSheet.create({
  rnholeView: {
    position: 'absolute',
    top: 110,
    width: '100%',
    height: '100%',
    // alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rnholeViewHeight: {
    x: startX,
    y: startY,
    width: rnHoleWidth,
    height: rnHoleHeight,
    borderRadius: borderRadiusOfCamera,
  },
  borderNotVerified: {
    position: 'absolute',
    top: startY + 110,
    left: startX,
    width: rnHoleWidth,
    height: rnHoleHeight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderRadius: borderRadiusOfCamera,
    borderWidth: borderWithOfCamera,
  },
  textBorder: {
    position: 'absolute',
    top: startY + 320,
    left: startX,
    width: rnHoleWidth,
    height: rnHoleHeight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderVerfied: {
    position: 'absolute',
    top: startY + 110,
    left: startX,
    width: rnHoleWidth,
    height: rnHoleHeight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green',
    borderRadius: borderRadiusOfCamera,
    borderWidth: borderWithOfCamera,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  textLinkStyle: {
    color: 'blue',
    paddingVertical: 20,
  },
  textErrorStatusStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.errorColor,
    borderRadius: getMScale(35),
    paddingHorizontal: getMScale(16),
    paddingVertical: getMScale(10),
  },
  textSuccessStatusStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGreenColor,
    borderRadius: getMScale(35),
    paddingHorizontal: getMScale(16),
    paddingVertical: getMScale(10),
  },
});
