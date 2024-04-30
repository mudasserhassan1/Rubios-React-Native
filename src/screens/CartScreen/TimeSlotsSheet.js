import BottomSheetHeader from '../../components/BottomSheetHeader/BottomSheetHeader';
import {BottomSheetFlatList, WINDOW_HEIGHT} from '@gorhom/bottom-sheet';
import {logToConsole} from '../../configs';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import RButton from '../../components/RButton';
import {constants, screens, strings} from '../../constants';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,} from 'react';
import {getMScale} from '../../theme/metrics';
import RText from '../../components/RText';
import {colors} from '../../theme';
import {
  addToDate,
  currentDateTime,
  formatDateTime,
  getCurrentDate,
  getDateDiff,
  strToDate,
} from '../../utils/timeUtils';
import TimeSlotCheckBox from '../../components/TimeSlotCheckBox';
import TimeSlotPlaceHolder from './TimeSlotPlaceHolder';
import PrepareNowIcon from '../../assets/svgs/PrepareNowIcon';
import {FlatList} from 'react-native-gesture-handler';
import {
  deleteBasketTimeWanted,
  getSingleRestaurantCalendar,
  removeBasketOrderSubmit,
  updateBasketTimeWanted,
} from '../../redux/actions/basket/checkout';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {useDispatch} from 'react-redux';
import {getNext7Days} from '../../utils/daysOfWeek';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {createTimeWantedPayload,} from '../../helpers/checkout';
import DaysListPlaceholder from './DaysListPlaceholder';
import {isIos} from "../../utils/sharedUtils";
import {finalizedTimeSlots, isAsapAvailable, makeDaysAndInitialSelection, makeRestaurantHours} from "./utils";

const TimeSlotsSheet = forwardRef(({}, ref) => {
  const [runOnce, setRunOnce] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(true);
  const [dateSlotsLoading, setDateSlotsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [restaurantHours, setRestaurantHours] = useState([]);
  const [isASAPOptionSelected, setIsASAPOptionSelected] = useState(false);
  const [updateTimeSlotLoading, setUpdateTimeSlotLoading] = useState(false);

  const horizontalListRef = useRef();
  const verticalListRef = useRef();
  const timSlotBottomSheetRef = useRef();
  const dispatch = useDispatch();

  const {basket = {}, calendar} = useBasketSelector();
  const {orderType: restaurantInfoOrderType = ''} = useRestaurantInfoSelector();

  const snapPoints = useMemo(() => ['90%'], []);

  const {
    TIME_FORMAT: {YMD, YYYYMMDD_HH_mm},
  } = constants;

  const {
    timemode = '',
    earliestreadytime = '',
    timewanted = '',
    leadtimeestimateminutes = '',
    vendorid = 0,
    id: basketId = '',
    deliverymode = '',
  } = basket || {};

  const days = useMemo(() => {
    const startDateWithLeadEstimates = addToDate(currentDateTime, leadtimeestimateminutes, 'minutes');
    return getNext7Days(startDateWithLeadEstimates)
  }, [leadtimeestimateminutes]);


  const orderType = restaurantInfoOrderType || deliverymode || '';

  useEffect(() => {
    if (basket && runOnce && vendorid) {
      if (timewanted) {
        const selectedTime = formatDateTime(
          timewanted,
          constants.TIME_FORMAT.YMD,
          constants.TIME_FORMAT.YYYYMMDD_HH_mm,
        );
        dispatch(getSingleRestaurantCalendar(vendorid, selectedTime, selectedTime));
      }
      dispatch(removeBasketOrderSubmit());
      setRunOnce(false);
    }
  }, [basket, dispatch, runOnce, timewanted, vendorid]);

  const handleInitialSelection = dayItem => {
    if (timewanted) {
      setDateSlotsLoading(true);
      onDateChange(dayItem, true);
      setSelectedTime(timewanted);
      setIsASAPOptionSelected(false);
    } else {
      onDateChange(dayItem);
      isAsapAvailable(restaurantHours) && setIsASAPOptionSelected(true);
      setSelectedTime('');
    }
  };

  useEffect(() => {
    if (calendar) {
      const hoursRange = makeRestaurantHours(calendar, orderType);
      setRestaurantHours(hoursRange);
    }
  }, [calendar]);

  const isAsapSelected = useMemo(() => {
    return timemode === 'asap';
  }, [timemode]);

  // logToConsole({timeSlots})
  useEffect(() => {
    if (restaurantHours?.length && basket) {
      const {slots, dayIndex, selectedTime: time} = finalizedTimeSlots(
          {
            restaurantHours,
            orderType,
            selectedDayIndex,
            basket,
            selectedDate
          })
      setTimeSlots(slots);
      setSelectedDayIndex(dayIndex);
      if (time) {
        setSelectedTime(time);
      }
    }
  }, [restaurantHours]);

  const handleCloseSheet = () => {
    timSlotBottomSheetRef?.current?.closeSheet();
    setTimeSlotsLoading(true);
    setDateSlotsLoading(true);
  };

  const doScrollRef = useRef(false);

  //If date and time is selected then scroll to respective index
  useEffect(() => {
    if (doScrollRef?.current && timeSlots?.length) {
      let dayIndex = days?.findIndex(
        item =>
          formatDateTime(item?.dateTime, 'DD') === formatDateTime(timewanted, 'DD', YYYYMMDD_HH_mm),
      );
      let timeIndex = timeSlots?.findIndex(item => item === timewanted);
      setTimeout(() => {
        if (dayIndex > -1) {
          setSelectedDayIndex(dayIndex);
          horizontalListRef?.current?.scrollToIndex({index: dayIndex, animated: true});
        }
      }, 300);

      setTimeout(() => {
        if (timeIndex > -1) {
          verticalListRef?.current?.scrollToIndex({index: timeIndex, animated: true});
        }
      }, 1000);
    }
  }, [YYYYMMDD_HH_mm, days, timeSlots, timewanted]);

  const isButtonDisabled = useMemo(() => {
    return (
      timewanted === selectedTime ||
      timeSlotsLoading ||
      dateSlotsLoading ||
      updateTimeSlotLoading ||
      (!selectedTime && !isASAPOptionSelected)
    );
  }, [
    dateSlotsLoading,
    isASAPOptionSelected,
    selectedTime,
    timeSlotsLoading,
    timewanted,
    updateTimeSlotLoading,
  ]);

  const timeSlotCallBack = () => {
    setTimeSlotsLoading(false);
    setDateSlotsLoading(false);
    timeSlots.length > 0 && verticalListRef?.current?.scrollToIndex({index: 0, animated: true});
  };

  const timeSlotsErrorCallback = () => {
    setTimeSlotsLoading(false);
    setDateSlotsLoading(false);
  };
  const onDateChange = (date = '', withScrolling = false) => {
    doScrollRef.current = withScrolling;
    setSelectedDate(date);
    setTimeSlotsLoading(true);
    if (basket) {
      dispatch(
        getSingleRestaurantCalendar(
          vendorid,
          formatDateTime(date?.dateTime, YMD),
          formatDateTime(date?.dateTime, YMD),
          timeSlotCallBack,
          timeSlotsErrorCallback,
        ),
      );
    }
  };

  const handleDayPress = (item, index) => {
    setSelectedDayIndex(index);
    setSelectedTime('');
    setTimeSlots([]);
    onDateChange(item, false);
    horizontalListRef?.current?.scrollToIndex({index, animated: true});
  };

  const onSelectAsap = useCallback(() => {
    setIsASAPOptionSelected(true);
    setSelectedTime('');
  }, []);

  const onModalTimeSlotRowPress = time => {
    if (time === 'ASAP') {
      setSelectedTime('');
      return onSelectAsap();
    }
    setSelectedTime(time);
    setIsASAPOptionSelected(false);
  };

  const onDonePress = () => {
    const timeValue =  selectedTime;
    if (!isAsapSelected && isASAPOptionSelected) {
      //on Error
      const errorCallback = () => {
        setUpdateTimeSlotLoading(false);
        setIsASAPOptionSelected(false);
        setSelectedTime(timewanted);
      };
      setUpdateTimeSlotLoading(true);
      return dispatch(deleteBasketTimeWanted(basket?.id, callBackStatus, errorCallback));
    }
    if (timeValue === '') {
      timSlotBottomSheetRef?.current?.closeSheet();
    } else {
      setUpdateTimeSlotLoading(true);
      onTimeSlotSelect(timeValue);
    }
  };

  const callBackStatus = () => {
    setUpdateTimeSlotLoading(false);
    handleCloseSheet();
  };

  const onTimeSlotSelect = selectedValue => {
    if (selectedValue) {
      const payload = createTimeWantedPayload(selectedValue);
      if (basket) {
        dispatch(updateBasketTimeWanted(basketId, payload, callBackStatus));
      }
    }
  };

  const earliestEstimatedTime = () => {
    let localTime = getCurrentDate();
    let earlyReadyTime = strToDate(earliestreadytime, YYYYMMDD_HH_mm);
    const minutes = getDateDiff(earlyReadyTime, localTime, 'minutes');
    return minutes > 0 ? earlyReadyTime : addToDate(localTime, leadtimeestimateminutes, 'minute');
  };

  const handleScrolling = index => {
    ///on opening slots bottom sheet i.e, bottom sheet is at index 0
    if (index === 0) {
      const {dayIndex, selectedDayItem} = makeDaysAndInitialSelection(basket);
      setSelectedDayIndex(dayIndex);
      handleInitialSelection(selectedDayItem);
    }
  };

  const open = () => {
    timSlotBottomSheetRef?.current?.openSheet?.();
  };

  const close = () => {
    timSlotBottomSheetRef?.current?.closeSheet?.();
  };

  useImperativeHandle(ref, () => ({open, close}));

  const renderDaysView = (item, index) => {
    const isSelected = index === selectedDayIndex;
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`${item.day}\n${item?.month + ' ' + item?.date}`}
        accessibilityHint={!isSelected ? 'activate to select day' : ''}
        accessibilityState={isIos ? {selected: !!isSelected}: {}}
        onPress={() => handleDayPress(item, index)}
        style={[
          styles.dayItem,
          isSelected ? styles.selectedItem : styles.unSelectedItem,
        ]}>
          <RText
            text={item.day}
            weight={'semiBold'}
            color={isSelected? colors.white : colors.primary}
            size={'sm'}
          />
          <RText
            textStyle={styles.dateStyle}
            text={item?.month + ' ' + item?.date}
            color={isSelected ? colors.white : colors.subTitleText}
            size={'xxs'}
          />
      </TouchableOpacity>
    );
  };

  const renderTimeSlotRow = ({item: time, index}) => {
    const isAsapRow = time === 'ASAP';
    const isChecked = isAsapRow
      ? isASAPOptionSelected
      : selectedTime && selectedTime?.includes(time);

    return (
      <TouchableOpacity
        accessible
        accessibilityHint={!isChecked ? 'activate to select time': ''}
        accessibilityState={isIos ? {selected: isChecked} : {}}
        activeOpacity={1}
        style={{paddingHorizontal: getMScale(16)}}
        key={String(index)}
        onPress={() => onModalTimeSlotRowPress(time)}>
        <View style={styles.timeSlotRow}>
          <RText
            color={colors.primary}
            size={'xxs'}
            weight={isChecked || isAsapRow ? 'semiBold' : 'regular'}
            text={
              isAsapRow
                ?
                  // `${time}`
                  `ASAP (${formatDateTime(earliestEstimatedTime(), 'h:mm A')})`
                : formatDateTime(
                    time,
                    constants.TIME_FORMAT.hour_mm_A,
                    constants.TIME_FORMAT.YYYYMMDD_HH_mm,
                  )
            }
            textStyle={styles.timeSlotText}
          />
          <TimeSlotCheckBox
            height={20}
            width={20}
            checked={isChecked}
            onValueChange={() => onModalTimeSlotRowPress(time)}
          />
        </View>
        <View style={styles.greyHorizontaTimeSlotlLine} />
      </TouchableOpacity>
    );
  };

  const renderSlotsEmptyComponent = () => {
    return (
      <View
        style={{
          height: WINDOW_HEIGHT * 0.5,
          rowGap: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <PrepareNowIcon width={100} height={100} />
        <RText size={'xs'} text={'No more slots available for this day.'} />
      </View>
    );
  };

  const renderDaysList = () => {
    if (dateSlotsLoading) {
      return <DaysListPlaceholder />;
    }
    if (days?.length) {
      return (
        <View>
          <FlatList
            ref={horizontalListRef}
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayList}
            keyExtractor={item => item?.id}
            renderItem={({item, index}) => renderDaysView(item, index)}
            onScrollToIndexFailed={e => logToConsole({onDaysScrollToIndexFailed: e?.message})}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <BottomSheetModalComponent
      ref={timSlotBottomSheetRef}
      snapPoints={snapPoints}
      snapIndex={0}
      onSheetChange={handleScrolling}
      onSheetDismiss={handleCloseSheet}
      hideHandleBar={true}>
      <BottomSheetHeader
        title={orderType === 'pickup' ? 'Schedule Pick Up' : 'Schedule Delivery'}
        onClose={handleCloseSheet}
      />
      {renderDaysList()}
      {timeSlotsLoading ? (
        <TimeSlotPlaceHolder />
      ) : (
        <BottomSheetFlatList
          ref={verticalListRef}
          data={timeSlots}
          renderItem={renderTimeSlotRow}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={renderSlotsEmptyComponent}
          contentContainerStyle={{paddingBottom: 90}}
          onScrollToIndexFailed={e => logToConsole({onScrollToIndexFailed: e})}
        />
      )}
      <View style={styles.donBtnStyle}>
        <RButton
          accessible
          accessibilityHint={'activate to confirm selected time slot.'}
          onPress={onDonePress}
          title={strings.done}
          disabled={isButtonDisabled}
          click_label={strings.done}
          click_destination={screens.CART}
          loading={updateTimeSlotLoading}
          buttonStyle={styles.doneBtn}
        />
      </View>
    </BottomSheetModalComponent>
  );
});
export default TimeSlotsSheet;
