import React, {useMemo} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import OrderDetailsView from '../../components/OrderDetailsView';
import TipAndCouponView from '../../components/TipAndCouponView';
import ApplyRewards from './ApplyRewards';
import useCheckoutHook from './useCheckoutHook';
import {constants, screens, strings} from '../../constants';
import RText from '../../components/RText';
import {colors} from '../../theme';
import OrderPaymentMethods from '../../components/OrderPaymentMethodsInfo/OrderPaymentMethods';
import RButton from '../../components/RButton';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import InfoComponent from '../../components/InfoComponent';
import PersonIcon from '../../assets/svgs/PersonIcon';
import CheckoutEmailIcon from '../../assets/svgs/CheckoutEmailIcon';
import PhoneIcon from '../../assets/svgs/PhoneIcon';
import Divider from '../../components/Divider';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import AddGiftCardModalJSX from '../../components/AddGiftCardModalJSX/AddGiftCardModalJSX';
import AddCreditCardBottomSheet from './AddCreditCardBottomSheet';
import AddCreditCardJSX from '../../components/AddCreditCardJSX/AddCreditCardJSX';
import CheckBox from '../../components/CheckBox/CheckBox';
import InputField from '../../components/InputField';
import CreditCardsListBottomSheet from './CreditCardsListBottomSheet';
import {images} from '../../assets';
import YellowEllipse from '../../assets/svgs/YellowEllipse';
import TacoSvg from '../../assets/svgs/TacoSvg';
import MenuScreenHeader from '../../components/MenuScreenHeader/MenuScreenHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SpinnerOverly from '../../components/LoadingComponent/SpinnerOverly';
import UtensilsCheckoutIcon from '../../assets/svgs/UtensilsCheckoutIcon';
import GiftCardsListBottomSheet from './GiftCardsListSheet';
import BottomSheetHeader from '../../components/BottomSheetHeader/BottomSheetHeader';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {formatWithMask} from 'react-native-mask-input';
import AddressIcon from '../../assets/svgs/AddressIcon';
import PrepareNowIcon from '../../assets/svgs/PrepareNowIcon';
import TimeSlotsSheet from '../CartScreen/TimeSlotsSheet';
import {isIos} from "../../utils/sharedUtils";

const CheckoutScreen = ({route, navigation}) => {
  const {
    isGuest,
    orderType,
    restaurantAddressString,
    providerToken,
    first_name,
    last_name,
    products,
    isPlaceOrderButtonDisabled,
    getChoicesString,
    tipPercentage,
    setTipPercentage,
    onOrderConfirmed,
    onOrderFailed,
    scrollRef,
    renderUserInfoInputsJSX,
    renderPasswordInputsJSX,
    renderTermsAndConditionsCheckboxJSX,
    renderSignupAndLoginButton,
    renderBirthdayInput,
    renderEmailInput,
    renderEmailUpdatesCheckboxJSX,
    renderDOBPicker,
    renderMobileNumberInput,
    onPlaceOrder,
    bottomSheetSnapPoints,
    bottomSheetRef,
    showGiftCardBottomSheet,
    hideGiftCardBottomSheet,
    deliveryInstructions,
    setDeliveryInstructions,
    isContactLessDelivery,
    setIsContactLessDelivery,
    creditCardsListBottomSheet,
    showCreditCardListBottomSheet,
    isVisibleAddCreditCard,
    setIsVisibleAddCreditCard,
    onIframeReady,
    placingOrder,
    utensilsReducer,
    showGiftCardsListBottomSheet,
    giftCardsListSheetRef,
    changeContactInfoSheet,
    changeContactInfoSheetSnapPoints,
    updatedContactInfo,
    resetState,
    onConfirmChangeContactInfo,
    deliveryAddressString,
    timemode,
    slotsTitle,
    timSlotBottomSheetRef,
    showTimeSlotSheet,
      asapTime,
  } = useCheckoutHook();

  const {top} = useSafeAreaInsets();

  const renderInputsForGuest = () => {
    return (
      <View
          accessibilityElementsHidden={isVisibleAddCreditCard}
          style={{marginTop: 20, paddingHorizontal: getMScale(15)}}
      >
            {renderUserInfoInputsJSX()}
            {renderMobileNumberInput()}
            {renderEmailInput()}
            {renderEmailUpdatesCheckboxJSX()}
      </View>
    );
  };

  const renderGuestSignupView = () => {
    if (isGuest) {
      return (
        <View accessibilityElementsHidden={isVisibleAddCreditCard} style={{marginTop: getMScale(49)}}>
          <ImageBackground
            source={images.checkout_guest_portion_bg}
            style={{
              width: SCREEN_WIDTH,
              height: getMScale(120),
              flexDirection: 'row',
              paddingHorizontal: getMScale(20),
              // alignItems: 'center',
            }}
            resizeMode={'cover'}>
            <View style={{marginTop: getMScale(18)}}>
              <YellowEllipse />
              <View style={{position: 'absolute', top: 8, start: getMScale(32)}}>
                <TacoSvg />
              </View>
            </View>
            <RText
              text={'CREATE AN ACCOUNT AND START EARNING POINTS TODAY!'}
              accessibilityLabel={'create an account and start earning points today!'}
              size={'xs'}
              weight={'headerBold'}
              color={colors.secondary}
              textStyle={{
                position: 'absolute',
                start: getMScale(161),
                width: getMScale(209),
                height: getMScale(92),
                lineHeight: 24,
                marginVertical: getMScale(24),
              }}
            />
          </ImageBackground>
          <RText
            color={colors.palette.primary_50}
            text={
              'Password must be 8-16 characters and include a letter, number and special character.'
            }
            size={'xs'}
            textStyle={{marginTop: getMScale(24), marginHorizontal: getMScale(20)}}
          />
          <View style={{paddingHorizontal: getMScale(15), marginTop: 5}}>
            {renderPasswordInputsJSX()}
            {renderBirthdayInput()}
            {renderTermsAndConditionsCheckboxJSX()}
            {renderSignupAndLoginButton()}
            {renderDOBPicker()}
          </View>
          <Divider style={{marginTop: getVerticalScale(20), width: '95%', alignSelf: 'center'}} />
          <RText
            text={'Order Details'}
            textStyle={{
              textTransform: 'uppercase',
              marginTop: getMScale(16),
              marginStart: getMScale(15),
              marginBottom: getMScale(4),
            }}
            weight={'headerBold'}
            accessibilityRole={'header'}
          />
        </View>
      );
    }
    return null;
  };

  const goToOrderTypeScreen = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'change',
      click_destination: screens.CHOOSE_ORDER_TYPE,
    });
    navigation.push(screens.CHOOSE_ORDER_TYPE, {
      changingOrderType: true,
      fromScreen: screens.CHECKOUT,
    });
  };
  const openChangeContactInfoSheet = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'change',
      click_destination: 'Open Change Contact Info Modal Sheet',
    });
    changeContactInfoSheet?.current?.openSheet();
  };

  const renderOrderInfo = () => {
    return (
      <View style={{paddingHorizontal: getMScale(15)}}>
        <InfoComponent
          titleText={`${
            orderType === 'pickup' ? strings.pick_up_in_store : strings.delivery_order
          }`}
          titleFontSize={'xs'}
          Image={AddressIcon}
          titleWeight={'semiBold'}
          subTitleSize={'xxs'}
          subTitle={orderType === 'dispatch' ? deliveryAddressString : restaurantAddressString}
          btnText={'Change'}
          orderType={orderType}
          containerStyle={{marginVertical: getMScale(5)}}
          onPress={goToOrderTypeScreen}
          accessibilityElementsHidden={isVisibleAddCreditCard}
        />
        <InfoComponent
          Image={PrepareNowIcon}
          titleText={timemode === 'asap' ? strings.prepare_now : strings.scheduled_for}
          titleFontSize={'xs'}
          titleWeight={'bold'}
          subTitleSize={'xxs'}
          subTitle={timemode === 'asap' ? `Ready ASAP ${asapTime}` : 'Ready ' + slotsTitle}
          btnText={'Schedule'}
          onPress={showTimeSlotSheet}
          containerStyle={{marginVertical: 5}}
          accessibilityElementsHidden={isVisibleAddCreditCard}
        />
      </View>
    );
  };

  const renderContactlessDeliveryInfo = () => {
    return (
      <View
          accessibilityElementsHidden={isVisibleAddCreditCard}
          style={{width: '90%', alignSelf: 'center'}}>
        <Divider style={styles.divider} />
        <CheckBox
            accessibilityRole={'checkbox'}
            accessibilityState={isIos ? {checked: !!isContactLessDelivery } : {}}
            accessibilityElementsHidden={isVisibleAddCreditCard}
            text={'I want contactless delivery'}
            checked={isContactLessDelivery}
            width={getMScale(16)}
            height={getMScale(16)}
            onValueChange={setIsContactLessDelivery}
            style={{marginTop: getVerticalScale(15)}}
        />
        <InputField
          label={'Delivery Instruction (Optional)'}
          placeholder={'Enter Delivery Instruction (Optional)'}
          containerStyle={{marginTop: getMScale(15), marginBottom: 0}}
          placeholderTextColor={'#D9D9D9'}
          value={deliveryInstructions}
          onChangeText={setDeliveryInstructions}
          maxLength={120}
          returnKeyType={'done'}
          accessibilityElementsHidden={isVisibleAddCreditCard}
        />
        <Divider style={[styles.divider, {marginBottom: getVerticalScale(15)}]} />
      </View>
    );
  };

  const userInfoAccessibilityLabel = useMemo(() => {
      if (isGuest) {
          return ''
      }
      const heading = `Confirm ${
          orderType === constants.handOffMode.DISPATCH ? 'Delivery' : 'Pick Up'
      } Contact`;
      const {first_name, last_name, phone, email} = Object.keys(updatedContactInfo).length > 0 ? updatedContactInfo : providerToken?.user;
      return `${heading} \n name\n ${first_name + ' ' + last_name}\n email\n ${email}\n phone\n ${phone}\n Change`
  }, [updatedContactInfo, providerToken, orderType, isGuest])

  const renderUserContactInfo = () => {
    return (
      <View
          accessible={!isVisibleAddCreditCard}
          accessibilityLabel={userInfoAccessibilityLabel}
          accessibilityHint={'activate to update contact info'}
          onAccessibilityTap={openChangeContactInfoSheet}
          accessibilityElementsHidden={isVisibleAddCreditCard}
          style={styles.contactInfoParent}>
        <View style={styles.contactInfoView}>
          <RText
            text={`Confirm ${
              orderType === constants.handOffMode.DISPATCH ? 'Delivery' : 'Pick Up'
            } Contact`}
            size={'xs'}
            accessibilityRole={'header'}
            weight={'semiBold'}
          />
          {['name', 'email', 'phone'].map((item, index) => {
            let value = updatedContactInfo[item] || providerToken?.user?.[item];
            if (item === 'phone') {
              let {masked} = formatWithMask({
                text: value?.replace(/\D/g, ''),
                mask: constants.MASKS.PHONE_MASK,
              });
              value = masked;
            }
            return (
              <View style={styles.contactInfoRow}>
                <View style={styles.contactInfoRowIcon}>
                  {item === 'name' ? (
                    <PersonIcon />
                  ) : item === 'email' ? (
                    <CheckoutEmailIcon />
                  ) : (
                    <PhoneIcon />
                  )}
                </View>
                <RText
                  text={item === 'name' ? `${first_name} ${last_name}` : value}
                  size={'xxs'}
                  textStyle={styles.contactInfoRowText}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          accessible={!isVisibleAddCreditCard}
          // accessibilityHint={'activate on change button to open change user details.'}
          onPress={openChangeContactInfoSheet}
          hitSlop={{left: 20, right: 20, top: 40, bottom: 40}}
          style={styles.contactInfoChangeText}>
          <RText text={'Change'} allowFontScaling={false} color={colors.primaryLink} weight={'semiBold'} size={'xxs'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderConfirmOrderItems = () => {
    return (
      <View accessibilityElementsHidden={isVisibleAddCreditCard}  style={styles.confirmOrderItemsParent}>
        <RText accessibilityElementsHidden={isVisibleAddCreditCard} accessibilityRole={'header'} text={'Confirm Order Items'} weight={'semiBold'} size={'xs'} />
        <View style={styles.productsContainer}>{products?.map(renderProductsMapper)}</View>
      </View>
    );
  };

  const renderProductsMapper = (item, index) => {
    const {name, choices, quantity, totalcost} = item || {};
    const isUtensilsItem = item.productId === utensilsReducer.utensilsProductId;

    const voiceOverLabel = `${quantity}x, ${name}\n ${getChoicesString(choices)}`
    return (
      <View
          accessible={!isVisibleAddCreditCard}
          accessibilityLabel={voiceOverLabel}
          accessibilityValue={{text: `$${totalcost}`}}
        key={String(index)}
        style={[styles.productItem, {borderBottomWidth: index < products.length - 1 ? 1 : 0}]}>
        {isUtensilsItem ? (
          <UtensilsCheckoutIcon />
        ) : (
          <View style={styles.quantityView}>
            <RText text={`${quantity}x`} weight={'semiBold'} size={'xxs'} />
          </View>
        )}
        <View
          style={[
            styles.nameAndChoicesView,
            {paddingTop: choices.length > 0 ? getVerticalScale(6) : 0},
          ]}>
          <RText
            text={isUtensilsItem ? 'Napkins & Utensils' : name}
            size={'xs'}
            weight={'semiBold'}
          />
          {choices.length > 0 ? (
            <View style={{marginTop: getVerticalScale(10), flexDirection: 'row'}}>
              <RText
                text={getChoicesString(choices)}
                size={'xs'}
                color={colors.palette.primary_50}
              />
            </View>
          ) : null}
        </View>
        <View
          style={[
            styles.priceView,
            choices?.length > 0 && {
              paddingTop: getVerticalScale(6),
              justifyContent: 'flex-start',
            },
          ]}>
          <RText
            text={`$${parseFloat(totalcost || 0).toFixed(2)}`}
            weight={'semiBold'}
            adjustFontToFit={true}
            minimumFontScale={0.5}
            size={'xxs'}
          />
        </View>
      </View>
    );
  };

  const renderOrderCalculations = () => {
    return (
      <View accessibilityElementsHidden={isVisibleAddCreditCard} style={styles.calculationContainer}>
        <OrderDetailsView calculationsOnly tipPercentage={tipPercentage} />
      </View>
    );
  };

  const renderPaymentMethodsView = () => {
    return (
      <View accessibilityElementsHidden={isVisibleAddCreditCard} style={styles.paymentMethodsView}>
        <OrderPaymentMethods
          onCardPress={billingMethod =>
            billingMethod === 'creditcard'
              ? showCreditCardListBottomSheet()
              : showGiftCardsListBottomSheet()
          }
          showGiftCardSheet={showGiftCardBottomSheet}
          showCreditCardSheet={() => setIsVisibleAddCreditCard(true)}
          placingOrder={placingOrder}
          showGiftCardListSheet={() => giftCardsListSheetRef?.current?.open()}
        />
      </View>
    );
  };

  const renderGiftCardBottomSheet = () => {
    return (
      <BottomSheetModalComponent
        ref={bottomSheetRef}
        hideHandleBar
        snapIndex={0}
        enableHandlePanningGesture={false}
        snapPoints={bottomSheetSnapPoints}>
        <AddGiftCardModalJSX
          onClose={hideGiftCardBottomSheet}
          expandBottomSheet={() => bottomSheetRef?.current?.expand()}
          collapseBottomSheet={() => bottomSheetRef?.current?.collapse()}
        />
      </BottomSheetModalComponent>
    );
  };

  const renderAddCreditCardSheet = () => {
    return (
      <AddCreditCardBottomSheet
        sheetContainerStyle={{marginTop: top + 20}}
        isOpen={isVisibleAddCreditCard}
        onClose={() => setIsVisibleAddCreditCard(false)}>
        <AddCreditCardJSX
            accessible={isVisibleAddCreditCard}
          onClose={() => {
            setIsVisibleAddCreditCard(false);
            global.isEditingCard = false;
          }}
          onOrderFailure={onOrderFailed}
          onOrderSuccess={onOrderConfirmed}
          onIframeReady={onIframeReady}
        />
      </AddCreditCardBottomSheet>
    );
  };

  const renderCreditCardsListSheet = () => {
    return (
      <CreditCardsListBottomSheet
        ref={creditCardsListBottomSheet}
        onPressAddCreditCard={() => {
          creditCardsListBottomSheet?.current?.close();
          setTimeout(() => setIsVisibleAddCreditCard(true), 300);
        }}
        onEditPress={() => {
          logFirebaseCustomEvent(strings.click, {
            click_label: 'add_credit_card',
            click_destination: 'Close Add Credit Card Bottom Sheet',
          });
          creditCardsListBottomSheet?.current?.close();
          setTimeout(() => setIsVisibleAddCreditCard(true), 300);
        }}
      />
    );
  };

  const renderGiftCardsListSheet = () => {
    return (
      <GiftCardsListBottomSheet
        ref={giftCardsListSheetRef}
        onPressAddGiftCard={() => {
          giftCardsListSheetRef?.current?.close();
          setTimeout(() => showGiftCardBottomSheet(), 300);
        }}
        // onEditPress={() => {
        //   creditCardsListBottomSheet?.current?.close();
        //   setTimeout(() => setIsVisibleAddCreditCard(true), 300);
        // }}
      />
    );
  };

  const renderChangeContactInfoSheet = () => {
    return (
      <BottomSheetModalComponent
        ref={changeContactInfoSheet}
        hideHandleBar
        snapIndex={0}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        snapPoints={changeContactInfoSheetSnapPoints}>
        <BottomSheetHeader
          title={'Contact Info'}
          onClose={() => {
            changeContactInfoSheet?.current?.closeSheet();
            resetState();
          }}
        />
        <KeyboardAwareScrollView
          enableOnAndroid
          style={{paddingHorizontal: getMScale(15), paddingTop: getMScale(15)}}>
          {renderUserInfoInputsJSX()}
          {renderEmailInput()}
          {renderMobileNumberInput()}
          <RButton
            accessibilityHint={'activate to save contact information.'}
            title={'Done'}
            onPress={onConfirmChangeContactInfo}
            buttonStyle={{width: '70%', alignSelf: 'center', marginTop: getMScale(20)}}
          />
        </KeyboardAwareScrollView>
      </BottomSheetModalComponent>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <MenuScreenHeader hideFromAccessibility={isVisibleAddCreditCard} showCartIcon={false} screenTitle={'CHECKOUT'} route={route} />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          extraHeight={50}
          extraScrollHeight={50}
          ref={scrollRef}
          alwaysBounceVertical={false}
          contentContainerStyle={{paddingBottom: getVerticalScale(50)}}
          style={{marginTop: getVerticalScale(5), paddingTop: getVerticalScale(20)}}>
          {renderOrderInfo()}
          {orderType === constants.handOffMode.DISPATCH ? renderContactlessDeliveryInfo() : null}
          {!isGuest ? renderUserContactInfo() : renderInputsForGuest()}
          {renderGuestSignupView()}
          {renderConfirmOrderItems()}
          {!isGuest ? <ApplyRewards accessibilityElementsHidden={isVisibleAddCreditCard}/> : null}
          <TipAndCouponView accessibilityElementsHidden={isVisibleAddCreditCard} updateOrderDetailTipPercent={setTipPercentage} />
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
          </View>
          {renderOrderCalculations()}
          <View style={{marginHorizontal: getMScale(15)}}>
            <Divider style={{marginTop: getVerticalScale(16)}} />
          </View>
          {renderPaymentMethodsView()}
          <RButton
            accessibilityHint={'activate to place order.'}
            accessibilityElementsHidden={isVisibleAddCreditCard}
            title={'Place Order'}
            disabled={isPlaceOrderButtonDisabled}
            onPress={onPlaceOrder}
            click_label={'Place Order'}
            click_destination={screens.DELIVERY_STATUS}
            titleStyle={{textTransform: 'uppercase'}}
            buttonStyle={{
              width: '75%',
              alignSelf: 'center',
              height: getVerticalScale(44),
              marginTop: getVerticalScale(35),
              marginBottom: getVerticalScale(70),
              borderRadius: 30,
            }}
          />
        </KeyboardAwareScrollView>
        <TimeSlotsSheet ref={timSlotBottomSheetRef} />
        {renderGiftCardBottomSheet()}
        {renderAddCreditCardSheet()}
        {renderCreditCardsListSheet()}
        {renderGiftCardsListSheet()}
        {renderChangeContactInfoSheet()}
      </View>
      <SpinnerOverly isLoading={placingOrder} withHeader={false} />
    </>
  );
};
export default CheckoutScreen;
