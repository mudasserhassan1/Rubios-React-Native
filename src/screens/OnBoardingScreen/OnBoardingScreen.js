import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  PermissionsAndroid,
  AccessibilityInfo,
  findNodeHandle,
} from 'react-native';
import {images} from '../../assets';
import RText from '../../components/RText';
import {colors} from '../../theme';
import PaginationDot from '../../components/PaginationDot';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {useDispatch, useSelector} from 'react-redux';
import {setIsOnBoarded} from '../../redux/actions/newUser';
import {constants, strings} from '../../constants';
import OnBoarding from '../../components/OnBoarding/OnBoarding';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid, isIos} from '../../utils/sharedUtils';
import {getMScale, getScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import RButton from '../../components/RButton';
import {PERMISSIONS, requestNotifications, RESULTS} from 'react-native-permissions';
import {checkPermissions} from '../../utils/permissionsUtils';
import messaging from '@react-native-firebase/messaging';
import {getFcmTokenSuccess} from '../../redux/actions/token';
import {logToConsole} from '../../configs';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';

let focusedPage = 0;
const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLocationPermissionAsked, setIsLocationPermissionAsked] = useState(false);

  const currentPageForScreenReader = useRef(0);

  const {width} = Dimensions.get('window');
  const dispatch = useDispatch();


  //Refs
  let flatListRef = useRef(null);

  const myElement = createRef();


  const {isAccessibilityOn = false} = useUserSelector();
  const {ON_BOARDING_DATA = []} = constants || {};
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'on_boarding_screen',
    });
  }, []);

  useEffect(() => {
      if (currentPage === 2 && isLocationPermissionAsked) {
          handleNext();
      }
  }, [isLocationPermissionAsked]);

  const handleNext = () => {
      let newIndex = currentPage + 1;
      focusedPage = newIndex;
      setCurrentPage(newIndex);
      currentPageForScreenReader.current = newIndex;
    if (newIndex < ON_BOARDING_DATA.length) {
        return flatListRef.current?.scrollToIndex?.({
        index: newIndex,
        animated: true,
      });
    }
    return completeOnBoarding();
  };

  useEffect(() => {
    if (isAccessibilityOn) {
      const reactTag = findNodeHandle(myElement?.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [currentPage, isAccessibilityOn, isLocationPermissionAsked]);

  const completeOnBoarding = () => {
    dispatch(setIsOnBoarded(true));
  };

  const handleSkip = () => {
    completeOnBoarding();
  };

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    // currentPageForScreenReader.current = index;
    setCurrentPage(index);
    focusedPage = index;
  };

  const shareLocation = async () => {
    const locationPermissionType = isIos
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    if (isLocationPermissionAsked) {
        handleNext();
    } else {
        checkPermissions(locationPermissionType).then(() => {
            setIsLocationPermissionAsked(true);
        })
    }
  };

  const allowNotifications = () => {
    requestNotificationPermission().then(r => handleNext?.());
  };

  async function requestNotificationPermission() {
    if (Platform === 'android') {
      const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      await handlePermissionResult(status);
    } else {
      const {status} = await requestNotifications(['alert', 'sound']);
      await handlePermissionResult(status);
    }
  }

  const handlePermissionResult = async r => {
    if (r === RESULTS.GRANTED) {
      try {
        if (isIos) {
          const token = await messaging().getAPNSToken();
          dispatch(getFcmTokenSuccess(token));
        } else {
          messaging()
              .registerDeviceForRemoteMessages()
              .then(async () => {
                const token = await messaging().getToken();
                dispatch(getFcmTokenSuccess(token));
              })
              .catch(e => {
                logToConsole({registerDeviceAndGetFCM: e.message});
              });
        }
      } catch (e) {
        logToConsole({registerDeviceAndGetFCM: e.message});
      }
    }
  };

  const onAccessibilityAction = event => {
    const value = event.nativeEvent.actionName === 'increment' ? 1 : -1;
    let newIndex = currentPage + value;
      flatListRef.current?.scrollToIndex?.({
          index: newIndex,
      });
      currentPageForScreenReader.current = newIndex;
      setCurrentPage(newIndex);
      focusedPage = newIndex;
  };

  const renderPaginationDots = () => {
    return (
      <View
        style={[
          styles.paginationContainer,
          {top: top + (isAndroid ? StatusBar.currentHeight || getMScale(50) : getMScale(15))},
        ]}>
        <View style={{height: 34}} />
        <View
            ref={myElement}
            accessibilityLabel={`Page ${currentPageForScreenReader.current + 1} of ${ON_BOARDING_DATA.length}`}
            style={styles.paginationDotContainer}
            accessible={true}>
          <PaginationDot
            size={10}
            curPage={currentPage}
            maxPage={ON_BOARDING_DATA.length}
            containerStyle={styles.dotContainerStyle}
            activeColor={colors.primary}
            inActiveColor={colors.primary}
            inActiveOpacity={0.2}
          />
        </View>
        <TouchableOpacity
          onPress={handleSkip}
          accessible
          accessibilityRole="button"
          accessibilityHint={'activate to skip onboarding screens.'}>
          <RText text={'Skip'} color={colors.secondary} textStyle={styles.skipButton} size={'xs'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTitleText = () => {
    return (
      <View
        style={{
          width: getMScale(300),
          alignSelf: 'center',
          position: 'absolute',
          top: getScale(120),
        }}>
        <RText
          accessible
          accessibilityRole={'header'}
          text={
            currentPage === 0
              ? 'BAJA-INSPIRED FLAVORS'
              : currentPage === 1
              ? 'ORDER YOUR FAVORITES'
              : currentPage === 2
              ? 'FIND DELICIOUS NEAR YOU'
              : currentPage === 3
              ? 'EAT AND CELEBRATE'
              : ''
          }
          size={'xxl'}
          weight={'headerBold'}
          numberOfLines={2}
          color={colors.secondary}
          textStyle={styles.onBoardingTitleStyle}
        />
        <View accessible={false} style={{marginTop: getVerticalScale(10)}}>
          <RText
            text={
              currentPage === 0
                ? 'Tacos, burritos & bowls, customized the way you want it.'
                : currentPage === 1
                ? 'Save time when you reorder your recent and most-loved items.'
                : currentPage === 2
                ? 'Your nearest location is only a click away.'
                : currentPage === 3
                ? 'Be the first to find out about new products, deals & personalized offers.'
                : ''
            }
            color={colors.primary}
            textStyle={styles.onBoardingSubTitleStyle}
            size={'sm'}
            accessibilityRole={'text'}
          />
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    const {image, title, text, withButton = false, buttons = []} = item || {};
    return (
      <View>
        <OnBoarding
          image={image}
          title={title}
          text={text}
          withButton={withButton}
          buttons={buttons}
          handleNext={handleNext}
        />
      </View>
    );
  };

  const renderPermissionsButton = () => {
      if (currentPage === 2) {
          return (
              <RButton
                  autoFocus={false}
                  accessible={currentPage === 2}
                  accessibilityHint={'activate to show location permission dialog'}
                  title={'Share location'}
                  buttonStyle={{
                      width: 340,
                      height: 44,
                      padding: 6,
                      marginVertical: 15,
                      backgroundColor: colors.secondary,
                      borderRadius: 23,
                  }}
                  onPress={shareLocation}
                  titleStyle={{
                      color: colors.white,
                      textTransform: 'uppercase',
                  }}
              />
          )
      }
      if (currentPage === 3) {
          return (
              <RButton
                  autoFocus={false}
                  accessible={currentPage === 3}
                  accessibilityHint={'activate to give notification permission.'}
                  title={'Allow Notifications'}
                  buttonStyle={{
                      width: 340,
                      height: 44,
                      padding: 6,
                      marginVertical: 15,
                      backgroundColor: colors.secondary,
                      borderRadius: 23,
                  }}
                  onPress={allowNotifications}
                  titleStyle={{
                      color: colors.white,
                      textTransform: 'uppercase',
                  }}
              />
          )
      }
      return null;
  }
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        extraData={currentPage}
        bounces={false}
        data={ON_BOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        onMomentumScrollEnd={event => {
          const {contentOffset} = event.nativeEvent;
          const currentIndex = Math.round(contentOffset.x / width);
          setCurrentPage(currentIndex);
          currentPageForScreenReader.current = currentIndex;
        }}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Carousel"
        access
        // accessibilityHint={'Swipe up or down with one finger to change the content'}
        accessibilityActions={[{name: 'increment'}, {name: 'decrement'}]}
        onAccessibilityAction={onAccessibilityAction}
      />
      {renderPaginationDots()}
      {renderTitleText()}
        <View
            style={{
                alignSelf: 'center',
                position: 'absolute',
                bottom: getScale(136),
            }}>
            {renderPermissionsButton()}
        </View>
      <TouchableOpacity
        accessible
        accessibilityLabel={'Next Slide'}
        accessibilityRole={'button'}
        accessibilityHint={
          ON_BOARDING_DATA.length - 1
            ? 'Activate to go to next slide.'
            : 'Activate to go to Last Onboarding screen.'
        }
        style={{
          width: getMScale(45),
          height: getMScale(45),
          borderRadius: getMScale(45) / 2,
          alignSelf: 'center',
          position: 'absolute',
          bottom: getScale(58),
          backgroundColor: colors.secondary,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleNext}>
        <ImageComponent
          resizeMode={'contain'}
          source={images.nextBtn}
          style={styles.nextBtnStyle}
        />
      </TouchableOpacity>
    </View>
  );
};
export default OnboardingScreen;
