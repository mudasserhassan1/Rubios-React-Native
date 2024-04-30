import moment from "moment/moment";
import {createTimeWantedPayload, generateNextAvailableTimeSlots, GetRestaurantHoursRange} from "../../helpers/checkout";
import {constants} from "../../constants";
import {currentDateTime, formatDateTime, isBetweenTime, strToDate} from "../../utils/timeUtils";
import {updateBasketTimeWanted} from "../../redux/actions/basket/checkout";
import {store} from "../../redux/store";
import {getNext7Days} from "../../utils/daysOfWeek";
import {CalendarTypeEnum} from "../../helpers/hoursListing";
import {logToConsole} from "../../configs";

export const getUpsellsProducts = upsells => {
  const sides = upsells?.filter(item => item.type === 'SIDE')[0];
  const drinks = upsells?.filter(item => item.type === 'DRINK')[0];
  const desserts = upsells?.filter(item => item.type === 'DESSERT')[0];

  return {
    upsellsSides: sides?.products || [],
    upsellsDrinks: drinks?.products || [],
    upsellsDesserts: desserts?.products || [],
  };
};

export const getUpsellsStatsFromOrder = (productsArr, upsells) => {
  let includeSides = false;
  let includeDrinks = false;
  let includesDesserts = false;

  const {upsellsSides, upsellsDesserts, upsellsDrinks} = getUpsellsProducts(upsells);
  productsArr.forEach(item => {
    upsellsSides.forEach(side => {
      if (item.productId === side.id) {
        includeSides = true;
      }
    });
    upsellsDesserts.forEach(dessert => {
      if (item.productId === dessert.id) {
        includesDesserts = true;
      }
    });
    upsellsDrinks.forEach(drink => {
      if (item.productId === drink.id) {
        includeDrinks = true;
      }
    });
  });
  return {
    sides: includeSides,
    drinks: includeDrinks,
    desserts: includesDesserts,
  };
};

export const makeDaysAndInitialSelection = (basket) => {
  const {timewanted, earliestreadytime} = basket || {};
  const {YYYYMMDD_HH_mm} = constants.TIME_FORMAT || {};
  const earliestStartDate = moment(earliestreadytime, YYYYMMDD_HH_mm);
  const daysFromEarliestDate = getNext7Days(earliestStartDate);
  let dayIndex = 0;
  if (timewanted) {
    dayIndex = daysFromEarliestDate?.findIndex(
        item =>
            formatDateTime(item?.dateTime, 'DD') === formatDateTime(timewanted, 'DD', YYYYMMDD_HH_mm),
    );
  }
  const selectedDayItem = daysFromEarliestDate[dayIndex];
  return {
    selectedDayItem,
    dayIndex
  }
}

export const makeRestaurantHours = (calendar, orderType) => {
    const {data} = calendar || {};
    let hoursRange = [];
    if (data) {
      let rangeFilter = orderType === 'dispatch' ? CalendarTypeEnum.dispatch : CalendarTypeEnum.business;
      hoursRange = GetRestaurantHoursRange(data, rangeFilter);
    }
  return hoursRange;
}

export const isAsapAvailable = (restaurantHours) => {
  if (!restaurantHours?.length) {
    return false;
  }
  const {YYYYMMDD_HH_mm} = constants.TIME_FORMAT || {};
  const {start, end} = restaurantHours[0];
  let openAt = strToDate(start, YYYYMMDD_HH_mm);
  let closeAt = strToDate(end, YYYYMMDD_HH_mm);
  let currentDate = strToDate(currentDateTime, YYYYMMDD_HH_mm);
  return isBetweenTime(currentDate, openAt, closeAt);
};

export const finalizedTimeSlots = ({restaurantHours, orderType,selectedDayIndex, basket, selectedDate}) => {
  let slots, dayIndex = selectedDayIndex, selectedTime = timewanted;
  const {start, end} = restaurantHours?.[0] || {};
  const {leadtimeestimateminutes, timewanted, earliestreadytime, timemode} = basket || {};
  const {YYYYMMDD_HH_mm} = constants.TIME_FORMAT || {};

  //add 15 minutes to start of restaurant hour.
  let earliestTimeSlot = moment(start, YYYYMMDD_HH_mm).format(YYYYMMDD_HH_mm);

  //For first day start slots with the earliest ready time.
  const isEarliestDay = dayIndex === 0;
  // if (isEarliestDay) {
  //   earliestTimeSlot = earliestreadytime;
  // }
  //earliest time has passed and now it is creating issue
  slots = generateNextAvailableTimeSlots(
      earliestTimeSlot,
      end,
      leadtimeestimateminutes,
      orderType,
      timewanted,
      selectedDate,
  );
  // logToConsole({slots, timemode})
  if (slots?.length > 0) {
    if (timemode !== 'asap') {
      if (!timewanted && isEarliestDay) {
        dayIndex = 0;
        selectedTime = slots?.[0];
        const payload = createTimeWantedPayload(selectedTime);
        basket && store.dispatch(updateBasketTimeWanted(basket?.id, payload));
      } else {
        selectedTime = timewanted;
      }
    }
    // else if (timemode === 'asap' && isAsapAvailable(restaurantHours)) {
    //   slots?.unshift('ASAP');
    // }
    else {
      logToConsole({insideElse: true})
    }
  }
  return {
    slots,
    dayIndex,
    selectedTime,
  }
}


