import {Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import styles from './styles';
import {screens, strings} from '../../constants';
import RButton from '../../components/RButton';
import CartItem from './CartItem';
import useCartHook from './useCartHook';
import RText from '../../components/RText';
import {colors} from '../../theme';
import OrderDetailsView from '../../components/OrderDetailsView';
import {Screen} from '../../components/Screen';
import InfoComponent from '../../components/InfoComponent';
import {getMScale} from '../../theme/metrics';
import AddressIcon from '../../assets/svgs/AddressIcon';
import PrepareNowIcon from '../../assets/svgs/PrepareNowIcon';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import SalsaRightIcon from '../../assets/svgs/SalsaRightIcon';
import CheckBox from '../../components/UtensilCheckBox';
import UtensilIcon from '../../assets/svgs/UtensilIcon';
import MenuScreenHeader from '../../components/MenuScreenHeader/MenuScreenHeader';
import SalsaBarSheet from './SalsaBarSheet';
import LocationsModal from '../SignupScreen/LocationsModal';
import CompleteYourOrder from './CompleteYourOrder';
import {FlatList} from 'react-native-gesture-handler';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import TimeSlotsSheet from './TimeSlotsSheet';
import {isIos} from "../../utils/sharedUtils";

const Cart = ({route, navigation}) => {
  const salsaBarSheetRef = useRef(null);

  const {
    products,
    getOptions,
    onCheckoutPress,
    onEditPress,
    orderType,
    timSlotBottomSheetRef,
    showTimeSlotSheet,
    basketLoading,
    slotsTitle,
    isVisibleChooseStoreModal,
    closeChooseStoreModal,
    isValidatingBasket,
    timemode,
    isUtensilRequired,
    onChangeUtensilsCheckbox,
    utensilsReducer,
    isUtensilsCheckboxDisabled,
    restaurantAddressString,
    deliveryAddressString,
    upsellsItemsKeys,
    setAddingUpsellsLoading,
      asapTime,
    addingUpsellsLoading,
  } = useCartHook({route});

  useEffect(() => {
    navigation.setParams({showCartIcon: false});
  }, [navigation]);

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyWrapper}>
        <ImageComponent
          source={images.emptyCartIcon}
          style={{height: getMScale(115), width: getMScale(115)}}
        />
        <RText
          text={strings.no_item_in_cart}
          color={colors.subTitleText}
          size={'xxs'}
          textStyle={styles.emptyTextStyle}
        />

        <RButton
          onPress={() => navigation.navigate(screens.CHOOSE_ORDER_TYPE)}
          title={strings.order_now}
          accessibilityHint={'activate to start order process.'}
          disabled={false}
          click_label={strings.order_now}
          click_destination={screens.CHOOSE_ORDER_TYPE}
          buttonStyle={styles.orderNowBtn}
        />
      </View>
    );
  };

  const listFooterComponent = () => {
    if (products?.length) {
      return (
        <>
          <TouchableOpacity
            accessible
            accessibilityRole={'button'}
            accessibilityHint={'activate to open salsa bar modal sheet'}
            style={{marginHorizontal: getMScale(15)}}
            activeOpacity={0.9}
            onPress={showBottomSheet}>
            <View style={styles.bottomSheetParent}>
              <ImageComponent
                source={images.salsaBackground}
                resizeMode={'stretch'}
                style={styles.headerBackgroundImageStyle}>
                <View style={styles.salsaParent}>
                  <Text allowFontScaling={false} style={{lineHeight: 24, fontSize: 16, width: '90%'}}>
                    <Text style={styles.salsaTextOne}>{strings.salsa_bar_text_one}</Text>{' '}
                    <Text
                      style={{
                        color: colors.salsaWhite,
                        fontSize: 16,
                        fontFamily: 'GritSans-Bold',
                        letterSpacing: 0.7,
                        textTransform: 'uppercase',
                        textShadowColor: 'black',
                        textShadowOffset: {width: -2, height: 1},
                        textShadowRadius: 2,
                        elevation: 3,
                      }}>
                      {strings.salsa_bar_text_two}
                    </Text>
                  </Text>
                  <SalsaRightIcon />
                </View>
              </ImageComponent>
            </View>
          </TouchableOpacity>
          <CompleteYourOrder onAddUpsellItem={setAddingUpsellsLoading} />
          <TouchableOpacity
            accessible
            accessibilityRole={'checkbox'}
            accessibilityState={isIos ? {checked: !!isUtensilRequired} : {}}
            accessibilityHint={'activate to toggle settings'}
            // aria-selected={isUtensilRequired}
            activeOpacity={0.7}
            onPress={() => onChangeUtensilsCheckbox(!isUtensilRequired)}
            style={styles.utensilIconParent}>
            <View style={styles.utensilIconInnerView}>
              <UtensilIcon />
              <RText
                text={strings.include_napkin}
                color={colors.primary}
                size={'xs'}
                weight={'semiBold'}
                textStyle={styles.includeNapkinTextStyle}
              />
            </View>
            <CheckBox
              height={20}
              width={20}
              checked={isUtensilRequired}
              disabled={isUtensilsCheckboxDisabled}
              onValueChange={onChangeUtensilsCheckbox}
            />
          </TouchableOpacity>
          {renderGreyHorizontalLine()}
          <View style={{paddingHorizontal: getMScale(15)}}>
            <OrderDetailsView />
          </View>
          <View style={styles.checkOutBtnStyle}>
            <RButton
              accessible
              accessibilityHint={'activate to go to checkout screen.'}
              onPress={onCheckoutPress}
              loading={isValidatingBasket}
              title={strings.checkout}
              click_label={strings.checkout}
              click_destination={screens.CHECKOUT}
              disabled={isValidatingBasket || addingUpsellsLoading}
              buttonStyle={styles.checkOutBtn}
            />
          </View>
        </>
      );
    }
    return null;
  };

  const renderItem = ({item}) => {
    if (item.productId === utensilsReducer.utensilsProductId) {
      return null;
    }
    return (
      <CartItem
        iconUrl={require('../../assets/images/placeholder.jpeg')}
        title={item.name.toString()}
        customization={getOptions(item?.choices)}
        price={'$ ' + item.totalcost.toFixed(2)}
        onEditPressed={() => onEditPress(item)}
        quantity={item?.quantity.toString()}
        item={item}
        containerStyle={{paddingHorizontal: getMScale(15)}}
        isUpsellItem={upsellsItemsKeys?.includes(item.productId)}
      />
    );
  };

  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;

  const renderSalsaBarSheet = () => {
    return (
      <SalsaBarSheet ref={salsaBarSheetRef} onClose={() => salsaBarSheetRef.current?.close()} />
    );
  };

  const showBottomSheet = useCallback(() => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'salsa_bar',
      click_destination: 'Open Salsa Bar Sheet Modal',
    });
    salsaBarSheetRef.current?.open?.();
  }, []);

  const handleChangeLocationPress = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'change',
      click_destination: screens.CHOOSE_ORDER_TYPE,
    });
    navigation.push(screens.CHOOSE_ORDER_TYPE, {
      changingOrderType: true,
      fromScreen: screens.CART,
    });
  };

  const ListHeaderComponent = () => {
    if (!products.length) {
      return null;
    }
    return (
      <View style={{paddingHorizontal: getMScale(20), marginTop: 10}}>
        <InfoComponent
          titleText={`${
            orderType === 'pickup' ? strings.pick_up_in_store : strings.delivery_order
          }`}
          orderType={orderType}
          titleFontSize={'xs'}
          Image={AddressIcon}
          titleWeight={'semiBold'}
          subTitleSize={'xxs'}
          subTitle={orderType === 'dispatch' ? deliveryAddressString : restaurantAddressString}
          btnText={'Change'}
          containerStyle={{marginVertical: getMScale(5)}}
          onPress={handleChangeLocationPress}
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
        />
        {renderGreyHorizontalLine()}
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <RButton
            accessibilityHint={'activate to add more items in cart.'}
            onPress={() => navigation.navigate(screens.MENU_CATEGORIES)}
            title={strings.add_more_menu_items}
            disabled={false}
            click_label={strings.add_more_menu_items}
            click_destination={screens.MENU_CATEGORIES}
            buttonStyle={styles.addMoreBtnStyle}
          />
        </View>
        {renderGreyHorizontalLine()}
        <RText
          accessible
          accessibilityRole={'header'}
          text={strings.my_orders_}
          size={'xs'}
          weight={'semiBold'}
          color={colors.primary}
          textStyle={styles.myOrderTextStyle}
        />
      </View>
    );
  };

  return (
    <>
      <Screen
        preset={'fixed'}
        backgroundColor={colors.white}
        withHeader
        contentContainerStyle={{flex: 1}}>
        <MenuScreenHeader
          showCartIcon={false}
          screenTitle={'MY BAG '}
          containerStyle={styles.header}
          route={route}
        />
        <FlatList
          data={products}
          style={styles.listStyle}
          contentContainerStyle={styles.listContainerStyle}
          keyExtractor={(_, index) => String(index)}
          ListEmptyComponent={listEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={listFooterComponent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          extraData={basketLoading}
        />
      </Screen>
      {renderSalsaBarSheet()}
      <TimeSlotsSheet ref={timSlotBottomSheetRef} />
      <LocationsModal
        isVisible={isVisibleChooseStoreModal}
        onItemClick={closeChooseStoreModal}
        onClose={closeChooseStoreModal}
      />
    </>
  );
};

export default Cart;
