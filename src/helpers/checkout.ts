import {
  BasketProduct,
  RequestBasketSubmit,
  RequestUpdateBasketTimeWanted,
  ResponseBasket,
  ResponseRestaurantCalendars,
} from '../types/olo-api';
import {DeliveryModeEnum, UserTypeEnum} from '../types/olo-api/olo-api.enums';
import {CalendarTypeEnum, HoursListing} from './hoursListing';
import moment from 'moment';
import {logToConsole} from "../configs";
import {updateProductRequest, updateProductSuccess} from "../redux/actions/basket/product/update";
import {store} from "../redux/store";
import {Alert} from "react-native";
import {addProductRequest} from "../redux/actions/basket/product/add";
import {removeProductSuccess} from "../redux/actions/basket/product/remove";
import {removeBasketCouponCode, updateDuplicateAddress} from "../redux/actions/basket/checkout";
import {requestDelUserDelAddress} from "../services/user";
import {getBasketRequest} from "../redux/actions/basket";

//function to avoid address duplication
export function removePreviousAddresses(
    basketAddresses: any,
    deliveryAddress: any,
    basket: any,
    removeAll = false,
) {
  if (basketAddresses?.duplicated?.length > 0) {
    let filterSavedAddress: number[] = [];

    if (!removeAll) {
      filterSavedAddress = basketAddresses?.duplicated?.filter(
          (addressId: any) =>
              basket?.deliveryaddress?.id !== addressId &&
              deliveryAddress?.id !== addressId,
      );
    } else {
      filterSavedAddress = basketAddresses?.duplicated;
    }
    if (filterSavedAddress?.length > 0) {
      filterSavedAddress.forEach((id: any) => {
        requestDelUserDelAddress(id).then(r => {});
      });
      const remainingAddress = basketAddresses?.duplicated.filter(
          (addressId: any) => !filterSavedAddress.includes(addressId),
      );
      store.dispatch(updateDuplicateAddress(remainingAddress));
    }
  }
}

export function generateSubmitBasketPayload(
  formData: any,
  billingSchemes: any,
  deliverymode: DeliveryModeEnum,
  authtoken: string,
  basket: any,
  basketAccessToken: any,
  isLoggedIn: boolean,
): RequestBasketSubmit {
  const billingSchemeStats = getBillingSchemesStats(billingSchemes);

  let billingaccounts: any = [];
  if (billingSchemeStats.selectedCreditCard === 1 || billingSchemeStats.selectedGiftCard > 0) {
    let tip = (basket && basket.tip) || 0;
    billingSchemes.forEach((account: any) => {
      if (account.selected) {
        let obj = {
          ...account,
        };
        if (account.billingaccountid) {
          obj.billingmethod = 'billingaccount';
          delete obj.saveonfile;
        }

        if (tip > 0) {
          if (obj.amount >= tip) {
            obj.tipportion = tip;
            tip = 0;
          } else {
            obj.tipportion = obj.amount;
            tip = +(tip - obj.amount).toFixed(2);
          }
        }
        delete obj.selected;
        delete obj.localId;
        delete obj.balance;
        billingaccounts.push(obj);
      }
    });
  }

  let payload = {
    id: basket?.id,
    accessToken: basketAccessToken,
    usertype: isLoggedIn ? UserTypeEnum.user : UserTypeEnum.guest,
    ...(!isLoggedIn && {guestoptin: formData.emailNotification}),
    ...(isLoggedIn && {authtoken}),
    billingaccounts,
  };

  if (
    [
      DeliveryModeEnum.curbside,
      DeliveryModeEnum.pickup,
      DeliveryModeEnum.dinein,
      DeliveryModeEnum.dispatch,
    ].includes(deliverymode)
  ) {
    payload = {
      ...payload,
      // @ts-ignore
      firstname: formData.firstName,
      lastname: formData.lastName,
      emailaddress: formData.email,
      contactnumber: formData.phone,
      receivinguser: {
        firstname: formData.firstName,
        lastname: formData.lastName,
        emailaddress: formData.email,
        contactnumber: formData.phone,
      },
    };
  }
  return payload;
}

export function formatCustomFields(customFields: [], formData: any) {
  let formatArray: any = [];

  customFields?.forEach((field: any) => {
    let obj = {};

    if (field.label === 'Table Number' && formData.tableNumber !== '') {
      obj = {
        id: field.id,
        value: formData.tableNumber,
      };
    } else if (field.label === 'Model' && formData.vehicleModal !== '') {
      obj = {
        id: field.id,
        value: formData.vehicleModal,
      };
    } else if (field.label === 'Make' && formData.vehicleMake !== '') {
      obj = {
        id: field.id,
        value: formData.vehicleMake,
      };
    } else if (field.label === 'Color' && formData.vehicleColor !== '') {
      obj = {
        id: field.id,
        value: formData.vehicleColor,
      };
    }
    if (Object.keys(obj).length) {
      formatArray.push(obj);
    }
  });

  return formatArray;
}

const isTimeSame = (fTime: string, sTime: string): boolean => {
  return fTime.split(' ')[1] === sTime.split(' ')[1];
};

export function GetRestaurantHoursRange(
  hours: ResponseRestaurantCalendars,
  type: CalendarTypeEnum,
): HoursListing[] {
  const selectedStoreHours = hours?.calendar.find(x => x.type === type);
  let newHoursArray: HoursListing[] = [];
  if (selectedStoreHours) {
    selectedStoreHours &&
      selectedStoreHours.ranges.forEach(item => {
        newHoursArray.push({
          label: item.weekday.substring(0, 1),
          start: item.start,
          end: item.end,
          isOpenAllDay: isTimeSame(item.start, item.end),
        });
      });
  }
  return newHoursArray;
}

const calculateMinutesDiff = (minutes: number): number => {
  if (minutes % 15 === 0) {
    return 0;
  } else {
    let difference = Math.trunc(minutes / 15);
    difference = (difference + 1) * 15 - minutes;
    return difference;
  }
};

// This function is updated as not available slots were not showing
export function generateNextAvailableTimeSlots(
  openingTime: string,
  closingTime: string,
  leadTime: number,
  orderType: string,
  timeWanted: string,
  selectedDate: string,
) {
  let timeSlots = [];
  let currentTime = moment();

  let startTime;
  let openAt = moment(openingTime, 'YYYYMMDD HH:mm');
  let closeAt = moment(closingTime, 'YYYYMMDD HH:mm');

  //Restaurant is closed
  if (currentTime.isAfter(closeAt)) {
    return [];
  } else if (currentTime.isBetween(openAt, closeAt)) {   //restaurant is open
    startTime = currentTime;
  } else {  //restaurant is still to open
    startTime = openAt;
  }
  //add lead time if minutes are less than 24Hrs i.e, 1440 otherwise start day will be next
   if (leadTime < 24 * 60) {
     startTime.add(leadTime, 'minutes');
   }
  // startTime.add(leadTime, 'minutes');
  let minutes = startTime.minutes();
  minutes = calculateMinutesDiff(minutes);
  startTime = startTime.add(minutes, 'minutes');

  let count = 0;
  const maxAllowed = 100;
  // Slots generation between open and close & time
  while (closeAt.diff(startTime, 'seconds') > 0 && count <= maxAllowed) {
    timeSlots.push(moment(startTime).format('YYYYMMDD HH:mm'));
    startTime && startTime.add(15, 'm');
    count++;
  }
  // In case if leadtime changed by the OLO, adding that selected time at the slots start
  if (timeWanted && selectedDate && orderType === 'dispatch') {
    const sameDay = moment(timeWanted, 'YYYYMMDD HH:mm').isSame(selectedDate, 'day');
    if (sameDay && !timeSlots.includes(timeWanted)) {
      timeSlots.unshift(timeWanted);
    }
  }
  return timeSlots;
}

export function createTimeWantedPayload(time: string) {
  const date = moment(time, 'YYYYMMDD HH:mm');

  const payload: RequestUpdateBasketTimeWanted = {
    ismanualfire: false,
    year: date.year(),
    month: date.month() + 1,
    day: date.date(),
    hour: date.hour(),
    minute: date.minute(),
  };
  return payload;
}

export function getUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getBillingSchemesStats(billingSchemes: any) {
  let billingSchemeStats: any = {
    creditCard: 0,
    giftCard: 0,
    selectedCreditCard: 0,
    selectedGiftCard: 0,
    savedCards: 0,
  };

  billingSchemes.forEach((account: any) => {
    billingSchemeStats = {
      creditCard:
        account.billingmethod === 'creditcard'
          ? billingSchemeStats.creditCard + 1
          : billingSchemeStats.creditCard,
      giftCard:
        account.billingmethod === 'storedvalue'
          ? billingSchemeStats.giftCard + 1
          : billingSchemeStats.giftCard,
      selectedCreditCard:
        account.billingmethod === 'creditcard' && account.selected
          ? billingSchemeStats.selectedCreditCard + 1
          : billingSchemeStats.selectedCreditCard,
      selectedGiftCard:
        account.billingmethod === 'storedvalue' && account.selected
          ? billingSchemeStats.selectedGiftCard + 1
          : billingSchemeStats.selectedGiftCard,
      savedCards:
        account.billingmethod === 'creditcard' && account.savedCard
          ? billingSchemeStats.savedCards + 1
          : billingSchemeStats.savedCards,
    };
  });

  return billingSchemeStats;
}

export function getCreditCardObj(cardDetails: any) {
  let cardObj: any = [
    {
      localId: getUniqueId(),
      selected: true,
      billingmethod: 'creditcard',
      amount: 0,
      tipportion: 0.0,
      expiryyear: cardDetails.exp_year,
      expirymonth: cardDetails.exp_month,
      zip: cardDetails.postal_code,
      saveonfile: cardDetails.savecard,
    },
  ];

  return cardObj;
}

export function getGiftCardObj(
  balanceResponse: any,
  billingSchemeId: any,
  body: any,
  billingSchemes: any,
) {
  const billingSchemeStats = getBillingSchemesStats(billingSchemes);

  let selected = billingSchemeStats.selectedGiftCard < 4;

  let cardObj: any = [
    {
      localId: getUniqueId(),
      selected: selected,
      billingmethod: 'storedvalue',
      balance: balanceResponse.balance,
      amount: 0,
      tipportion: 0.0,
      billingschemeid: billingSchemeId,
      saveonfile: 'true',
      billingfields: [
        {
          name: 'number',
          value: body.cardnumber,
        },
      ],
    },
  ];

  if (body.pin && body.pin !== '') {
    cardObj[0].billingfields.push({
      name: 'pin',
      value: body.pin,
    });
  }

  return cardObj;
}

export function updatePaymentCardsAmount(billingSchemes: any, basket: any) {
  let total = basket && basket.total ? basket.total : 0;
  billingSchemes.sort((a: any, b: any) =>
    b.billingmethod > a.billingmethod ? 1 : a.billingmethod > b.billingmethod ? -1 : 0,
  );

  billingSchemes.sort((a: any, b: any) =>
    a.balance > b.balance ? 1 : b.balance > a.balance ? -1 : 0,
  );

  billingSchemes = billingSchemes.map((account: any) => {
    if (account.selected) {
      if (account.billingmethod === 'storedvalue') {
        let giftCardAmount: any = account.balance >= total ? total : account.balance;
        total = (total - giftCardAmount).toFixed(2);
        account.amount = parseFloat(giftCardAmount);
      } else if (account.billingmethod === 'creditcard') {
        account.amount = parseFloat(total);
      }
    } else {
      account.amount = 0;
    }
    return account;
  });
  return billingSchemes;
}

export function remainingAmount(basket: any, billingSchemes: any) {
  if (basket && billingSchemes) {
    let amountSelected = billingSchemes.reduce((sum: any, account: any) => {
      if (account.selected) {
        sum = sum + account.amount;
      }
      return sum;
    }, 0);

    amountSelected = amountSelected.toFixed(2);
    amountSelected = parseFloat(amountSelected);

    let remainingTotal = (basket?.total - amountSelected).toFixed(2);

    if (remainingTotal !== 'NAN') {
      return remainingTotal;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

const reAddOrUpdateItem = (basketResponse: ResponseBasket, originalItem: BasketProduct) => {
  const {choices,id,  productId, quantity} = originalItem ?? {};
  const isProductExists = basketResponse?.products.some(item => item.productId === productId);
  const request: any = {};
  request.productid = productId;
  request.quantity = quantity;
  let options = '';
  choices.map(it => {
    options = options + it.optionid + ',';
  });
  request.options = options;
  const callback = () => store.dispatch(getBasketRequest(basketResponse.id));
  if (isProductExists) {
    return store.dispatch(
        // @ts-ignore
        updateProductRequest(
            basketResponse?.id,
            originalItem,
            request,
            callback,

        ),
    );
  }
  // @ts-ignore
  return  store.dispatch(addProductRequest(basketResponse.id, request, callback));
}

const removeCouponFromBasket = (basket: ResponseBasket) => {
//remove coupon logic
  store.dispatch(removeBasketCouponCode(basket?.id, ''));

}

export const removeItemHandler = async (responseBasket: ResponseBasket, item: BasketProduct) => {
  const couponItem = responseBasket.discounts?.filter(item => item?.type?.toLowerCase() === 'coupon')[0];
  const isCouponAddedButNotEligible = responseBasket?.products.length > 0 && couponItem && couponItem?.amount <= 0;
  const {productId} = item ?? {};
  const isProductExists = responseBasket?.products.some(item => item.productId === productId);

  if (isCouponAddedButNotEligible) {
    try {
      Alert.alert(
          'Remove Coupon?',
          'Your coupon won’t be valid for the order after removing this item from your cart. Are you sure you want to remove the coupon?',
          [
            {
              text: 'Cancel',
              onPress: () => reAddOrUpdateItem(responseBasket, item)
            },
            {
              text: 'Remove',
              onPress: () => removeCouponFromBasket(responseBasket)
            }
          ]
      )
    } catch (e) {
      logToConsole({e})
    }
  } else {
    //dispatch success actions if no coupon added or coupon criteria matched
    if (!isProductExists) {
      store.dispatch(removeProductSuccess(responseBasket))
    } else {
      store.dispatch(updateProductSuccess(responseBasket))
    }
  }
}
