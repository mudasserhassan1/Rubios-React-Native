import React, {useMemo} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import BackImage from '../../assets/svgs/BackImage';
import RText from '../../components/RText';
import {images} from '../../assets';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';
import {goBack} from '../../utils/navigationUtils';
import StoreLocationIcon from '../../assets/svgs/StoreLocationIcon';
import CircularArrowIcon from '../../assets/svgs/CircularArrowIcon';
import PickupTypeIcon from '../../assets/svgs/PickupTypeIcon';
import ChevronForward from '../../assets/svgs/ChevronForward';
import DeliveryTypeIcon from '../../assets/svgs/DeliveryTypeIcon';
import styles from './styles';
import useChooseOrderType from './useChooseOrderType';
import LocationsModal from '../SignupScreen/LocationsModal';
import {constants, screens, strings} from '../../constants';
import {formatLocationName} from '../../utils/sharedUtils';
import CalendarPlaceHolder from './CalendarPlaceHolder';
import {useNavigation} from '@react-navigation/native';
import SpinnerOverly from '../../components/LoadingComponent/SpinnerOverly';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const ChooseOrderType = ({route}) => {
  const navigation = useNavigation();
  const {
    name,
    restaurantAddress,
    toggleMoreHours,
    todayCalendar,
    fullWeekCalendar,
    distance,
    top,
    showMoreHours,
    restaurantCalendar,
    isLocationModalVisible,
    hideLocationModal,
    onSelectLocation,
    onChooseOrderType,
    loading,
    supportsdispatch,
    handoffModeLoading,
    fromHome,
    selectedOrderType,
    handleChangeRestaurantPress,
    handleStatusbarChanges,
    restaurant,
  } = useChooseOrderType(route);

  const skipAScreen = route?.params?.comingFromRewards || route?.params?.comingFromCart || false;

  const giToBackScreen = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'backIcon',
      click_destination: screens.HOME_SCREEN,
    });
    goBack();
  };
  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Back'}
          accessibilityRole={'button'}
          accessibilityHint={'activate to go to previous screen'}
          hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
          activeOpacity={0.7}
          onPress={giToBackScreen}>
          <BackImage color={'#ffffff'} />
        </TouchableOpacity>
        <RText
          text={fromHome ? 'Back to Home' : 'Back'}
          accessibilityRole={'header'}
          weight={'headerBold'}
          size={'lg'}
          color={colors.white}
          textStyle={styles.headerTitle}
        />
      </View>
    );
  };

  const renderCalendarInfo = () => {
    if (loading) {
      return <CalendarPlaceHolder />;
    }
    if (restaurantCalendar?.length) {
      return (
        <View accessible style={styles.calendarInfoView}>
          <View>
            {showMoreHours ? (
              <>
                {fullWeekCalendar.map((item, index) => {
                  return (
                    <RText
                      key={String(index)}
                      text={item}
                      size={'xxs'}
                      color={colors.textGray}
                      textStyle={[styles.otherDaysCalendarText, index === 0 && {marginTop: 0}]}
                    />
                  );
                })}
              </>
            ) : (
              <RText text={todayCalendar} size={'xxs'} color={colors.textGray} />
            )}
          </View>
          <TouchableOpacity
            accessible
            accessibilityHint={
              !showMoreHours ? 'activate to show More Hours' : 'activate to show today hours.'
            }
            onPress={toggleMoreHours}
            hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}>
            <RText
                maxFontSizeMultiplier={1.1}
              text={showMoreHours ? "Today's Hours" : 'More Hours'}
              color={colors.primaryLink}
              size={'xxs'}
              textStyle={styles.moreHoursText}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };


  const calenderInfoLabel = useMemo(() => {
      let string = '';
      if (!showMoreHours) {
          string = todayCalendar?.replace('-', ' to ')
      } else {
          string = '';
          fullWeekCalendar.forEach(item => {
              string = string + item?.replace('-', ' to ') + ', ';
          })
      }
      return string
  }, [showMoreHours, todayCalendar, fullWeekCalendar])

  const renderSelectedRestaurantInfo = () => {
    const formattedName = formatLocationName(name);
    return (
      <View
        accessible
        onAccessibilityTap={toggleMoreHours}
        accessibilityHint={`activate to show ${showMoreHours ? 'today' : 'more'} hours`}
        accessibilityLabel={formattedName}
        accessibilityValue={{text: `${restaurantAddress}\n${calenderInfoLabel}`}}
        style={{
          backgroundColor: colors.white,
          width: SCREEN_WIDTH * 0.9,
          alignSelf: 'center',
          borderRadius: 15,
          paddingVertical: 15,
        }}>
        <View style={styles.storeLocationInfoContainer}>
          <StoreLocationIcon />
          <RText
            text={formattedName}
            weight={'bold'}
            numberOfLines={2}
            textStyle={styles.storeName}
          />
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.bottomInfoContainer}>
          <View style={styles.addressContainer}>
            <RText
              text={restaurantAddress}
              size={'xs'}
              textStyle={{width: distance === 0 ? '95%' : '70%', lineHeight: 18}}
              numberOfLines={2}
            />
            {distance > 0 ? (
              <RText text={distance + ' mi'} size={'xs'} color={colors.textGray} />
            ) : null}
          </View>
          {renderCalendarInfo()}
        </View>
      </View>
    );
  };

  const renderChangeStoreText = () => {
    return (
      <TouchableOpacity
        accessibilityLabel={'Change Restaurant'}
        accessibilityRole={'button'}
        accessibilityHint={'activate to Open Change Restaurant Modal Sheet with.'}
        activeOpacity={0.8}
        onPress={handleChangeRestaurantPress}
        style={styles.changeStoreContainer}>
        <RText
          text={'Change Restaurant'}
          color={colors.white}
          textStyle={styles.changeStoreText}
          size={'xs'}
        />
        <View style={styles.circleArrowIcon}>
          <CircularArrowIcon color={'#FFFFFF'} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrderTypes = () => {
    return (
      <View style={styles.bottomContainer}>
        <RText accessible accessibilityRole={'header'} text={'Choose:'} weight={'bold'} />
        <TouchableOpacity
          accessible
          accessibilityRole={'button'}
          accessibilityHint={'activate to choose pickup order type'}
          activeOpacity={0.8}
          onPress={() => onChooseOrderType(constants.handOffMode.PICKUP)}
          style={styles.orderTypeRowView}>
          <View style={styles.orderTypeInnerLeftView}>
            <PickupTypeIcon />
            <RText text={'Pickup'} weight={'semiBold'} />
          </View>
          <ChevronForward />
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityRole={'button'}
          accessibilityHint={'activate to choose delivery order type'}
          activeOpacity={0.8}
          disabled={!supportsdispatch}
          onPress={() => onChooseOrderType(constants.handOffMode.DISPATCH)}
          style={[styles.orderTypeRowView, !supportsdispatch && {opacity: 0.7}]}>
          <View style={styles.orderTypeInnerLeftView}>
            <DeliveryTypeIcon />
            <RText text={'Delivery'} weight={'semiBold'} />
          </View>
          <ChevronForward />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLocationModal = () => {
    return (
      <LocationsModal
        isVisible={isLocationModalVisible}
        onClose={() => (!restaurant ? navigation.goBack() : hideLocationModal())}
        onItemClick={onSelectLocation}
        onModalShow={() => handleStatusbarChanges('dark-content')}
        onModalHide={() => handleStatusbarChanges('light-content')}
        selectedOrderType={selectedOrderType}
      />
    );
  };
  return (
    <View style={styles.parentContainer}>
      <ImageBackground
        source={images.drawer_background}
        style={[
          styles.imageBackgroundContainer,
          {
            paddingTop: top,
          },
        ]}>
        {renderHeader()}
        {renderSelectedRestaurantInfo()}
        {renderChangeStoreText()}
      </ImageBackground>
      {renderOrderTypes()}
      {renderLocationModal()}
      <SpinnerOverly isLoading={handoffModeLoading} withHeader={false} />
    </View>
  );
};
export default ChooseOrderType;
