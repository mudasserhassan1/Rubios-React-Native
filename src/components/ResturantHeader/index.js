import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import React, {useEffect, useState} from 'react';
import {getResturantCalendarRequest} from '../../redux/actions/restaurant/calendar';
import {useDispatch, useSelector} from 'react-redux';
import {CalendarTypeEnum} from '../../helpers/hoursListing';
import {GetUserFriendlyHoursRAW} from '../../helpers/getUserFriendlyHours';
import RText from '../RText';
import {addToDate, currentDateTime, formatDateTime, strToDate} from '../../utils/timeUtils';
import {constants, strings} from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../theme';
import ModalComponent from '../ModalComponent/ModalComponent';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {useMemo} from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';

const RestaurantHeader = () => {
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [restaurantHours, setRestaurantHours] = useState([]);

  const dispatch = useDispatch();
  const {restaurant, orderType: restaurantInfoOrderType} = useRestaurantInfoSelector();
  const {calendar} = useSelector(state => state.restaurantCalendar);

  const {name = '', id} = restaurant || {};

  const {basket} = useBasketSelector();
  const {
    timemode = '',
    earliestreadytime = '',
    leadtimeestimateminutes = 0,
    timewanted = '',
    deliverymode = '',
  } = basket || {};

  const orderType = restaurantInfoOrderType || deliverymode || '';
  const getEstTimeFormat = (date, mins) => {
    const formatted = strToDate(date ?? currentDateTime, constants.TIME_FORMAT.YYYYMMDD_HH_mm);
    const afterAddition = addToDate(formatted, mins, 'minutes');
    return formatDateTime(afterAddition, 'dddd h:mm A');
  };

  const estimatedDeliveryTime = useMemo(() => {
    if (orderType === 'dispatch') {
      if (timemode === 'asap') {
        return getEstTimeFormat(earliestreadytime, leadtimeestimateminutes);
      } else if (timewanted) {
        return getEstTimeFormat(timewanted, leadtimeestimateminutes);
      }
    }
  }, [earliestreadytime, leadtimeestimateminutes, orderType, timemode, timewanted]);

  useEffect(() => {
    if (restaurant) {
      let today = new Date();
      let dateFrom =
        today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate() + '';
      const lastWeekDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
      const dateTo =
        lastWeekDate.getFullYear() * 1e4 +
        (lastWeekDate.getMonth() + 1) * 100 +
        lastWeekDate.getDate() +
        '';
      dispatch(getResturantCalendarRequest(id, dateFrom, dateTo));
    }
  }, [restaurant]);

  useEffect(() => {
    if (calendar) {
      setRestaurantHours(GetUserFriendlyHoursRAW(calendar, CalendarTypeEnum.business));
    }
  }, [calendar]);

  const renderHoursRow = item => {
    return (
      <View key={String(item.weekday)} style={styles.rowModal}>
        <RText textStyle={styles.todayText} text={`${item.weekday.toUpperCase()}`} />

        <RText
          textStyle={styles.timingText}
          text={`${item?.isOpenAllDay ? strings.open_24_hours : getTiming(item)}`}
        />
      </View>
    );
  };

  const renderRestaurantDetailsModal = () => {
    return (
      <ModalComponent isVisible={isInfoDialogOpen} onRequestClose={() => setInfoDialogOpen(false)}>
        <View style={styles.modal}>
          {restaurantHours?.map((item, index) => renderHoursRow(item, index))}
          <TouchableOpacity style={styles.modalOK} onPress={() => setInfoDialogOpen(false)}>
            <RText text={strings.ok} textStyle={styles.modalButton2} />
          </TouchableOpacity>
        </View>
      </ModalComponent>
    );
  };

  const getTimeFormat = date => {
    return formatDateTime(date, constants.TIME_FORMAT.h_mm_A, constants.TIME_FORMAT.YYYYMMDD_HH_mm);
  };
  const getTiming = todayTiming => {
    let start = getTimeFormat(todayTiming?.start);
    let end = getTimeFormat(todayTiming?.end);
    return start + ' - ' + end;
  };
  return (
    <View style={styles.root}>
      <RText textStyle={styles.headerText}>
        {orderType === constants.handOffMode.DISPATCH
          ? 'Delivery From' + ' - ' + name
          : orderType + ' - ' + name}
      </RText>
      <View style={styles.todayHoursContainer}>
        {orderType === constants.handOffMode.DISPATCH ? (
          <RText
            textStyle={styles.todayTiming}
            text={`ESTIMATED DELIVERY TIME: ${estimatedDeliveryTime}`}
          />
        ) : restaurantHours ? (
          <View style={{flexDirection: 'row'}}>
            <RText textStyle={styles.todayHoursTitle} text={strings.hours} />
            <RText
              textStyle={styles.todayTiming}
              text={`${restaurantHours[0]?.weekday.toUpperCase()} ${
                restaurantHours[0]?.isOpenAllDay ? 'Open 24 hours' : getTiming(restaurantHours[0])
              }`}
            />
          </View>
        ) : null}
      </View>
      <TouchableOpacity style={styles.icon} onPress={() => setInfoDialogOpen(true)}>
        <AntDesign size={30} color={colors.white} name={'infocirlce'} />
      </TouchableOpacity>
      {renderRestaurantDetailsModal()}
    </View>
  );
};

export default RestaurantHeader;
