import React, {useMemo} from 'react';
import {images} from '../../assets';
import {SCREEN_HEIGHT} from '../../theme/metrics';
import RButton from '../../components/RButton';
import {colors} from '../../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageBackground, Platform, StatusBar, TouchableOpacity, View} from 'react-native';
import RText from '../../components/RText';
import QRCode from '../../assets/svgs/QRCode';
import styles from './styles';
import RewardsInfo from '../../components/RewardsInfo/RewardsInfo';
import useHomeScreenHook from './useHomeScreenHook';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import GuestBottomSheetBody from '../../components/GuestBottomSheetBody/GuestBottomSheetBody';
import QRCodeIcon from '../../assets/svgs/QRCodeIcon';
import LocationsModal from '../SignupScreen/LocationsModal';
import DrawerHeader from '../../navigations/DrawerNavigator/DrawerHeader';
import HomeSideBarMenuSheet from '../../components/HomeSideMenuBody/HomeSideBarMenuSheet';
import OrderInProgress from '../../components/OrderInProgress';
import OrderInProgressIcon from '../../assets/svgs/OrderInProgressIcon';
import {navigateTo} from '../../utils/navigationUtils';
import {screens, strings} from '../../constants';
import moment from 'moment';
import RewardsCodeBottomSheet from '../../components/RewardsCodeBottomSheet';
import ShimmerView from '../../components/ButtonShimmerView';
import CircleShimmerView from '../../components/ButtonShimmerView/circleShimmerView';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {homeSideMenuBarSheetStatus} from '../../redux/actions/modalSheetStatus';
import {useDispatch} from 'react-redux';

const HomeScreen = () => {
  const {top} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['25%', '100%'], []);
  const rewardsCodeSnapPoints = useMemo(() => ['93%'], []);
  const dispatch = useDispatch();
  const {
    handleQRCodePress,
    onStartOrderPress,
    isReorderEligible,
    bottomSheetRef,
    sideMenuSheetRef,
    isVisibleLocationModal,
    hideLocationModal,
    onSelectLocation,
    showOrderInProgressView,
    userRecentOrders,
    rewardsCodeSheetRef,
    reorderLoading,
    userDataLoading,
    restaurantsLoading,
    selectedRestaurantForOrder,
    userProfile,
    closeRewardsCodeBottomSheet,
    isGuest,
    onSigninPress,
    scanSnapPoints,
    isAccessibilityEnabledOnHomeScreen,
  } = useHomeScreenHook();

  const {deliverymode, readytime, id: orderId, status, vendorid} = userRecentOrders?.[0] || {};

  const orderInProgressTap = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'order_in_progress',
      click_destination: screens.DELIVERY_STATUS,
    });
    navigateTo(screens.DELIVERY_STATUS, {orderId: orderId, vendorid: vendorid});
  };

  const value = deliverymode === 'dispatch' ? 'Delivery' : deliverymode;
  const deliveryModeValue = value?.charAt(0).toUpperCase() + value?.slice(1);
  const stx = deliverymode === 'pickup' ? ' • Requested ' : ' • Estimated ';
  const finalString = deliveryModeValue + stx;
  const renderBottomSheet = () => {
    const renderQRCodeIcon = () => {
      return <QRCodeIcon />;
    };
    return (
        <BottomSheetModalComponent ref={bottomSheetRef} snapPoints={scanSnapPoints} snapIndex={0}>
          <GuestBottomSheetBody
              TitleImage={renderQRCodeIcon}
              shadowImage={true}
              closeBottomSheet={() => bottomSheetRef?.current?.closeSheet()}
              title={'Scan to earn \n points!'}
              description={'Login or create an account to scan your rewards and get free Rubios!'}
          />
        </BottomSheetModalComponent>
    );
  };

  const renderLocationModal = () => {
    return (
        <LocationsModal
            isVisible={isVisibleLocationModal}
            onClose={hideLocationModal}
            onItemClick={onSelectLocation}
        />
    );
  };
  const closeHomeSideBarMenuSheet = () => {
    dispatch(homeSideMenuBarSheetStatus(false));
    sideMenuSheetRef?.current?.closeSheet();
  };
  const renderHomeSideMenuSheet = () => {
    return (
        <BottomSheetModalComponent
            hideHandleBar
            ref={sideMenuSheetRef}
            onSheetDismiss={() => StatusBar.setBarStyle('dark-content')}
            snapPoints={snapPoints}
            renerBackrop={false}
            enableContentPanningGesture={false}>
          <HomeSideBarMenuSheet closeBottomSheet={closeHomeSideBarMenuSheet} />
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
            // enableDynamicSizing={true}
            onSheetDismiss={closeRewardsCodeBottomSheet}
            enableContentPanningGesture={true}>
          <RewardsCodeBottomSheet closeBottomSheet={closeRewardsCodeBottomSheet} />
        </BottomSheetModalComponent>
    );
  };

  // Accessibility actions for iOS
  const iosAccessibilityActions = [
    {
      name: 'add',
      label: 'add',
    },
    {
      name: 'remove',
      label: 'Remove Item',
    },
    {
      name: 'decrease',
      label: 'Decrease quantity',
    },
    {
      name: 'increase',
      label:  'Increase quantity',
    },
  ];

  // Set accessibility actions based on the platform
  const accessibilityActions = Platform.select({
    ios: iosAccessibilityActions,
    android: [], // No need for custom actions on Android in this example
  });

  const handleAdd = () => {
    // Perform "Add" action
    console.log('Add action performed');
  };

  const handleRemoveItem = () => {
    // Perform "Remove item" action
    console.log('Remove item action performed');
  };

  const handleDecreaseQuantity = () => {
    // Perform "Decrease quantity" action
    console.log('Decrease quantity action performed');
  };

  const handleIncreaseQuantity = () => {
    // Perform "Increase quantity" action
    console.log('Increase quantity action performed');
  };

  const handleParentAccessibilityAction = (actionName) => {
    // Perform the corresponding action based on the provided actionName
    switch (actionName) {
      case 'add':
        handleAdd();
        break;
      case 'remove':
        handleRemoveItem();
        break;
      case 'decrease':
        handleDecreaseQuantity();
        break;
      case 'increase':
        handleIncreaseQuantity();
        break;
      default:
        break;
    }

  };

  const renderOrderInProgressIcon = () => <OrderInProgressIcon />;

  return (
      <ImageBackground
          resizeMode={'stretch'}
          source={images.homeScreen}
          style={[styles.backgroundParent, {paddingTop: top + 30}]}>
        {
          showOrderInProgressView ? (
              <OrderInProgress
                  accessible={isAccessibilityEnabledOnHomeScreen}
                  Image={renderOrderInProgressIcon}
                  titleText={
                    status === 'Scheduled' || status === 'In Progress' ? strings.orderInProgress : ''
                  }
                  titleFontSize={'xs'}
                  titleWeight={'bold'}
                  subTitleSize={'xxs'}
                  subTitle={finalString + moment(readytime, 'YYYYMMDD HH:mm').format('ddd hh:mm A')}
                  onEditPress={orderInProgressTap}
                  orderInProgress
                  containerStyle={styles.orderInProgressContainer}
              />
          ) : (
              <RewardsInfo
                  accessible={isAccessibilityEnabledOnHomeScreen}
                  containerStyle={{top: SCREEN_HEIGHT * 0.57}}
                  withGuestContent
                  loading={userDataLoading}
              />
          )}
        <DrawerHeader bottomSheetRef={sideMenuSheetRef} />
        <TouchableOpacity
            accessible={isAccessibilityEnabledOnHomeScreen}
            accessibilityLabel={'Scan'}
            accessibilityRole={'button'}
            accessibilityHint={'activate to Open Scan Modal Sheet.'}
            activeOpacity={0.8}
            onPress={handleQRCodePress}
            disabled={userDataLoading || restaurantsLoading}
            style={styles.qrcodeContainer}>
          {userDataLoading && !userProfile ? (
              <CircleShimmerView backgroundColor={colors.white} />
          ) : (
              <>
                <QRCode />
                <RText
                    text={'Scan'}
                    color={colors.secondary}
                    weight={'semiBold'}
                    size={'xxs'}
                    textStyle={styles.scanText}
                    accessible={isAccessibilityEnabledOnHomeScreen}
                />
              </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            {userDataLoading && !selectedRestaurantForOrder ? (
                <ShimmerView
                    isReorderEligible={isReorderEligible}
                    backgroundColor={colors.primaryYellow}
                />
            ) : (
                <RButton
                    accessible={isAccessibilityEnabledOnHomeScreen}
                    title={'Start Order'}
                    onPress={onStartOrderPress}
                    accessibilityHint={'activate to Start your Order.'}
                    allowFontScaling={false}
                    buttonStyle={[
                      styles.startOrderButton,
                      isReorderEligible && styles.smallStartOrderButton,
                    ]}
                    titleStyle={[
                      {color: colors.secondaryColor},
                      isReorderEligible && styles.smallStartOrderButtonTitle,
                    ]}
                />
            )}

            {isReorderEligible ? (
                userDataLoading && !userRecentOrders.length ? (
                    <ShimmerView
                        isReorderEligible={isReorderEligible}
                        backgroundColor={colors.greyLine}
                    />
                ) : (
                    <RButton
                        title={'Reorder'}
                        onPress={() => navigateTo(screens.MY_ORDERS)}
                        accessible={isAccessibilityEnabledOnHomeScreen}
                        accessibilityHint={'activate to open My Orders Screen'}
                        loading={reorderLoading}
                        allowFontScaling={false}
                        click_label={strings.reorder}
                        click_destination={screens.MY_ORDERS}
                        buttonStyle={styles.reorderButton}
                        titleStyle={styles.reorderButtonTitle}
                    />
                )
            ) : null}
          </View>
          {isGuest ? (
              <TouchableOpacity
                  accessible={isAccessibilityEnabledOnHomeScreen}
                  accessibilityHint={'activate to open sign up screen'}
                  style={styles.alreadyMemberSigninView}
                  onPress={onSigninPress}>
                <RText
                    accessible={isAccessibilityEnabledOnHomeScreen}
                    color={colors.white}
                    textStyle={styles.alreadyMemberText}
                    text={'Already a member? Sign in!'}
                    size={'xs'}
                />
              </TouchableOpacity>
          ) : null}
        </View>
        {renderBottomSheet()}
        {renderLocationModal()}
        {renderHomeSideMenuSheet()}
        {renderRewardsCodeBottomSheet()}
      </ImageBackground>
  );
};

export default HomeScreen;
