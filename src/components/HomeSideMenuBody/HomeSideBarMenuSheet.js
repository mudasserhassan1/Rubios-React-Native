import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, ImageBackground, Linking, ScrollView, StatusBar, TouchableOpacity, View,} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {useDispatch} from 'react-redux';
import styles from './styles';
import {
  COLLAPSE_ABLE_KEYS,
  collapseAbleMeta,
  drawerData,
  drawerLowerDataGuest,
  drawerLowerDataUser,
  modalDataObj,
  modalKeys,
} from './drawerConstants';
import {screens, strings} from '../../constants';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {colors} from '../../theme';
import RText from '../RText';
import BottomSheetModalComponent from '../BottomSheetModal/BottomSheetModalComponent';
import GuestBottomSheetBody from '../GuestBottomSheetBody/GuestBottomSheetBody';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isAndroid, isIos} from '../../utils/sharedUtils';
import ImageComponent from '../ImageComponent/ImageComponent';
import {images} from '../../assets';
import {userLogout} from '../../redux/actions/user';
import {useNavigation} from '@react-navigation/native';
import useRewardsOnBoardingSelector from '../../hooks/reduxStateHooks/useRewardsOnBoardingSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import RewardsCodeBottomSheet from '../RewardsCodeBottomSheet';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import useModalSheetStatusSelector from '../../hooks/reduxStateHooks/useModalSheetStatusSelector';
import QRCodeIcon from '../../assets/svgs/QRCodeIcon';
import useFirebaseConfigSelector from "../../hooks/reduxStateHooks/useFirebaseConfigSelector";
import {navigateTo} from "../../utils/navigationUtils";

const HomeSideBarMenuSheet = ({closeBottomSheet}) => {
  const [collapse, setCollapsed] = useState(true);
  const [modalKey, setModalKey] = useState('');
  const guestSnapPoints = useMemo(() => ['59.7%'], []);
  const rewardsCodeSnapPoints = useMemo(() => ['93%'], []);
  const navigation = useNavigation();
  const {userViewedRewardsOnBoarded = false} = useRewardsOnBoardingSelector();
  const {contact_us_url, nutrition_page_url, faqs_url,} = useFirebaseConfigSelector();


  const {userProfile = {}} = useUserSelector();
  const {first_name = ''} = userProfile || {};
  const {isGuest = false} = useGuestSelector();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const {isAccessibilityEnabledOnHomeScreen = false} = useModalSheetStatusSelector() || {};
  const rewardsCodeSheetRef = useRef();
  const scanBottomSheetRef = useRef();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const renderHorizontalLine = () => <View style={styles.horizontalLineStyle} />;
  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;

  const toggleExpanded = () => {
    setCollapsed(!collapse);
  };

  useEffect(() => {
    const backAction = () => {
      closeBottomSheet?.();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);


  const handleNavigation = async (screen, click_label, destination = '') => {
    navigateTo(screen);
    await logFirebaseCustomEvent(strings.click, {
      click_label,
      click_destination: destination || screen,
    });
  }

  const handleOpeningBrowser = async (url, click_label, click_destination) => {
    const canOpen = await Linking?.canOpenURL(url);
    if (canOpen) {
      Linking?.openURL(url);
      await logFirebaseCustomEvent(strings.click, {
        click_label,
        click_destination,
      });
    }
  }

  const onTapMetaData = async metaItem => {
    const {screen, analyticsLabel} = metaItem ?? {};
    await handleNavigation(screen, analyticsLabel);
  }

  const onTap = async actionKey => {
    const {screen, key, destination} = modalDataObj[actionKey] || {};
    switch (actionKey) {
      case modalKeys.REWARDS:
      case modalKeys.ORDERS:
      case modalKeys.FAVOURITES:
      case modalKeys.SCAN:
        await handlePresentModalPress({screen, key, destination});
        break;
      case modalKeys.PROFILE:
        toggleExpanded();
        break;
      case modalKeys.REFER:
        await handleNavigation(screens.INVITE_FRIENDS,'refer_a_friend');
        break;
      case modalKeys.CONTACT:
        await handleOpeningBrowser(contact_us_url, 'contact_us',  'contact_us_browser');
        break;
      case modalKeys.NUTRITION:
        await handleOpeningBrowser(nutrition_page_url,'nutrition_info', 'nutrition_info_browser')
        break;
      case modalKeys.FAQ:
        await handleOpeningBrowser(faqs_url,'faqs', 'faqs_browser')
        break;
      case modalKeys.LOGOUT:
        await logFirebaseCustomEvent(strings.click, {
          click_label: 'logout',
          click_destination: screens.LAST_ONBOARDING,
        });
        dispatch(userLogout());
        break;
      case modalKeys.ACCOUNT:
        await logFirebaseCustomEvent(strings.click, {
          click_label: 'create_an_account',
          click_destination: screens.SIGNUP,
        });
        closeBottomSheet?.();
        navigation.navigate('AuthStack', {
          screen: screens.SIGNUP,
          params: {comingFromSideMenu: true},
        });
        break;
      default:
        break;
    }
  };

  const closeRewardsCodeBottomSheet = () => {
    rewardsCodeSheetRef?.current?.closeSheet();
    logFirebaseCustomEvent(strings.click, {
      click_label: 'crossIcon',
      click_destination: 'Close Modal Sheet',
    }).then();
  };

  const handlePresentModalPress = useCallback(
    async ({key, screen, destination}) => {
      if (key === modalKeys.SCAN) {
        if (isGuest) {
          return scanBottomSheetRef?.current?.openSheet?.();
        }
        return rewardsCodeSheetRef?.current?.openSheet();
      }
      if (isGuest) {
        bottomSheetRef.current?.openSheet?.();
        return setModalKey(key);
      }
      if (key === modalKeys.REWARDS && !userViewedRewardsOnBoarded) {
        return await handleNavigation(screens.REWARDS_ONBOARDING, screen);
      }
      return await handleNavigation(screen, screen, destination);
    },
    [isGuest, navigation, userViewedRewardsOnBoarded],
  );

  const renderProfileView = (index) => {
    return (
      <Collapsible key={String(index)} collapsed={collapse} align="center">
        <View style={styles.collapseableView}>
          {collapseAbleMeta.map(item => {
            const {title, key} = item || {};
            return (
              <TouchableOpacity
                accessible
                accessibilityRole={'button'}
                accessibilityLabel={`${title},activate to open ${title} screen`}
                onPress={() => onTapMetaData(item)}>
                <RText
                  size={'xs'}
                  weight={'medium'}
                  color={colors.primary}
                  textStyle={{
                    lineHeight: getVerticalScale(17.5),
                    letterSpacing: 0.15,
                    paddingTop: key === COLLAPSE_ABLE_KEYS.ADDRESS ? getMScale(0) : getMScale(15),
                  }}
                  text={title}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        {renderGreyHorizontalLine()}
      </Collapsible>
    );
  };

  const renderBottomSheet = () => {
    const {Image, text, subtitle} = modalDataObj[modalKey] || {};
    return (
      <BottomSheetModalComponent
        ref={bottomSheetRef}
        snapIndex={0}
        snapPoints={isGuest ? guestSnapPoints : null}>
        <GuestBottomSheetBody
          TitleImage={() => <Image />}
          title={text}
          closeBottomSheet={() => bottomSheetRef.current?.closeSheet()}
          description={subtitle}
          closeSideMenu={closeBottomSheet}
        />
      </BottomSheetModalComponent>
    );
  };

  const renderRewardsCodeBottomSheet = () => {
    return (
      <BottomSheetModalComponent
        hideHandleBar
        ref={rewardsCodeSheetRef}
        snapPoints={rewardsCodeSnapPoints}
        renerBackrop={true}
        snapIndex={0}
        enableContentPanningGesture={true}>
        <RewardsCodeBottomSheet closeBottomSheet={closeRewardsCodeBottomSheet} />
      </BottomSheetModalComponent>
    );
  };

  const {top} = useSafeAreaInsets();

  const renderHeaderView = () => {
    return (
      <View style={[styles.container, {marginTop: isIos ? top + 5 : top + 15}]}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Close'}
          accessibilityRole={'button'}
          accessibilityHint={'activate to close modal sheet'}
          onPress={closeBottomSheet}
          style={styles.crossButton}>
          <ImageComponent source={images.drawerCross} style={styles.crossBtn} />
        </TouchableOpacity>
        <RText
          accessible={true}
          text={isGuest ? 'HI THERE!' : 'HI ' + first_name + '!'}
          accessibilityRole={'header'}
          color={colors.white}
          weight={'headerBold'}
          size={'xxl'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          textStyle={styles.nameTextStyle}
        />
      </View>
    );
  };
  const renderScanBottomSheet = () => {
    const renderQRCodeIcon = () => {
      return <QRCodeIcon />;
    };
    return (
      <BottomSheetModalComponent
        ref={scanBottomSheetRef}
        snapPoints={guestSnapPoints}
        snapIndex={0}>
        <GuestBottomSheetBody
          TitleImage={renderQRCodeIcon}
          shadowImage={true}
          closeBottomSheet={() => scanBottomSheetRef?.current?.closeSheet()}
          title={'Scan to earn \n points!'}
          description={'Login or create an account to scan your rewards and get free Rubios!'}
        />
      </BottomSheetModalComponent>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <ImageBackground source={images.drawer_background}>
        {renderHeaderView()}
        {renderHorizontalLine()}
      </ImageBackground>
      <ScrollView bounces={false} contentContainerStyle={{paddingBottom: getMScale(50)}}>
        <ImageBackground
          source={images.drawer_background}
          style={styles.headerBackgroundImageStyle}>
          <View>
            {drawerData.map((item, index) => {
              const {title, Image, key} = item || {};
              return (
                <>
                  <TouchableOpacity
                    accessible
                    accessibilityLabel={title}
                    accessibilityRole={'button'}
                    accessibilityHint={`activate to open ${title} screen`}
                    onPress={() => onTap(key)}>
                    <View style={styles.upperViewParentStyle}>
                      <View style={styles.upperInnerViewStyle}>
                        <Image isGuest={isGuest} />
                        <RText
                          text={title}
                          color={colors.white}
                          weight={'semiBold'}
                          size={'xs'}
                          textStyle={styles.textStyle}
                        />
                      </View>
                      <View>
                        <ImageComponent
                          source={images.rightArrow}
                          resizeMode={'contain'}
                          style={styles.rightBtn}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {index !== 3 && renderHorizontalLine()}
                </>
              );
            })}
          </View>
        </ImageBackground>
        <View style={styles.bottomWhiteArea}>
          {(isGuest ? drawerLowerDataGuest : drawerLowerDataUser).map((item, index) => {
            const {title, key} = item || {};
            return (
              <>
                <TouchableOpacity
                  accessible
                  accessibilityRole={!isAndroid && !isGuest && index === 0 ? 'menu': null}
                  accessibilityState={!isGuest && index === 0 && {expanded: !collapse }}
                  accessibilityHint={
                    index === 5
                        ? 'activate to logout from your account'
                        : index === 0 && !isGuest && !collapse
                            ? 'activate to collapse profile & settings.'
                            : index === 0 && !isGuest && collapse
                                ? `activate to expand profile & settings.`
                                : `activate to open ${title} screen`
                  }
                  onPress={() => onTap(key)}>
                  <View style={styles.lowerViewParentStyle}>
                    <View style={styles.upperInnerViewStyle}>
                      <RText
                        text={title}
                        color={colors.primary}
                        weight={'semiBold'}
                        size={'xs'}
                        textStyle={
                          index === 3 && !isGuest
                            ? styles.logOutTextStyle
                            : index === 0 && isGuest
                            ? styles.creatAccountTextStyle
                            : styles.sideMenuLowerItemstextStyle
                        }
                      />
                    </View>
                    {index === 0 && !isGuest ? (
                        <ImageComponent
                          source={images.chevronDownBlack}
                          // source={!collapse && index === 0 ? images.chevronDownBlack : images.rightArrow}
                          resizeMode={'contain'}
                          // style={!collapse && index === 0 ? styles.downBtn : styles.rightBtn}
                          style={{width: 20, height: 20}}
                        />
                    ) : null}
                  </View>
                </TouchableOpacity>
                {index !== 5 && !isGuest && renderGreyHorizontalLine()}
                {index !== 2 && isGuest && renderGreyHorizontalLine()}
                {index === 0 && renderProfileView(index)}
              </>
            );
          })}
        </View>
      </ScrollView>
      {renderScanBottomSheet()}
      {renderBottomSheet()}
      {renderRewardsCodeBottomSheet()}
    </View>
  );
};
export default HomeSideBarMenuSheet;
