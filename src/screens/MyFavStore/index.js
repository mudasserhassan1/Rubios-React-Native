import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import RText from '../../components/RText';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';
import StoreLocationIcon from '../../assets/svgs/StoreLocationIcon';
import CircularArrowIcon from '../../assets/svgs/CircularArrowIcon';
import styles from './styles';
import useMyFavStoreHook from './useMyFavStoreHook';
import {formatLocationName} from '../../utils/sharedUtils';
import CalendarPlaceholder from './CalendarPlaceholder';
import {Screen} from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';

const MyFavStore = () => {
  const {
    name,
    restaurantAddress,
    toggleMoreHours,
    todayCalendar,
    fullWeekCalendar,
    distance,
    showMoreHours,
    restaurantCalendar,
    loading,
    favLocation,
    handleShowLocation,
  } = useMyFavStoreHook();

  const renderCalendarInfo = () => {
    if (loading) {
      return <CalendarPlaceholder />;
    }
    if (restaurantCalendar?.length) {
      return (
        <View style={styles.calendarInfoView}>
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
            onPress={toggleMoreHours}
            hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}>
            <RText
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
  const renderSelectedRestaurantInfo = () => {
    const formattedName = formatLocationName(name);
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          alignSelf: 'center',
          borderRadius: 15,
          paddingVertical: 15,
          backgroundColor: colors.white,

          ...Platform.select({
            ios: {
              shadowColor: 'rgba(162, 162, 162, 0.3)',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.7,
              shadowRadius: 10,
            },
            android: {
              elevation: 30,
            },
          }),
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
        accessible
        accessibilityHint={
          !favLocation
            ? 'activate to open choose restaurant modal'
            : 'activate to open change restaurant sheet'
        }
        activeOpacity={0.8}
        onPress={handleShowLocation}
        style={styles.changeStoreContainer}>
        <RText
          text={!favLocation ? 'Choose Restaurant' : 'Change Restaurant'}
          color={colors.secondary}
          textStyle={styles.changeStoreText}
          size={'xs'}
        />
        <View style={styles.circleArrowIcon}>
          <CircularArrowIcon color={colors.secondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMyFavStoreText = () => {
    return (
      <RText
        text={''}
        color={colors.primary}
        size={'md'}
        weight={'semiBold'}
        textStyle={styles.myFavStoreText}
      />
    );
  };
  return (
    <Screen
      preset={'fixed'}
      backgroundColor={colors.white}
      withHeader
      contentContainerStyle={{flex: 1}}>
      <ScreenHeader showCartButton={false} title={'Favorite RESTAURANT'} />
      {renderMyFavStoreText()}
      {favLocation ? renderSelectedRestaurantInfo() : null}
      {renderChangeStoreText()}
    </Screen>
  );
};
export default MyFavStore;
