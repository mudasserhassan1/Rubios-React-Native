import {Alert, ScrollView, StatusBar, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles';
import useReorderHook from '../../hooks/useReorderHook';
import RText from '../../components/RText';
import {constants, screens, strings} from '../../constants';
import {images} from '../../assets';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {formatDateTime} from '../../utils/timeUtils';
import InfoComponent from '../../components/InfoComponent';
import PickUpIcon from '../../assets/svgs/PickUpIcon';
import {getMScale} from '../../theme/metrics';
import {colors} from '../../theme';
import CartItem from '../CartScreen/CartItem';
import {deleteFavOrder} from '../../redux/actions/user';
import {useDispatch} from 'react-redux';
import {getOrderStatus, getRestaurantInfo} from '../../services/restaurant';
import Star from '../../assets/svgs/Star';
import RButton from '../../components/RButton';
import RestaurantCardLoader from './RestaurantCardLoader';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import AddToFavBottomSheet from './AddToFavBottomSheet';
import MyFavIcon70 from '../../assets/svgs/MyFavIcon70';
import MenuScreenHeader from '../../components/MenuScreenHeader/MenuScreenHeader';
import BlueFilledStar from '../../assets/svgs/BlueFilledStar';
import LoadingOverlay from '../../components/LoadingComponent/SpinnerOverly';
import {useNavigation} from '@react-navigation/native';
import LocationIcon from '../../assets/svgs/locationIcon';
import OrderPriceLoader from './OrderPriceLoader';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const OrderDetailScreen = ({route}) => {
  const [restauraantAddress, setRestauraantAddress] = useState('');
  const [resturantCityState, setRestaurantCityState] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [estimateTax, setEstimateTax] = useState('');
  const [tip, setTip] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(true);
  const [delLoading, setdelLoading] = useState(false);

  const {
      onReorder, reorderLoading, onFavouriteReorder, favLoading} = useReorderHook();

  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  const bottomSheetRef = useRef();
  const navigation = useNavigation();

  const item = route?.params;
  const {
    readytime,
    deliverymode,
    products = [],
    vendorid = 0,
    id = 0,
    name: Headername,
    online = false,
  } = item?.item || {};

  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;

  const getOptions = options => {
    let val = '';
    options.map(item => {
      val = val + ' ' + item.name.trim() + ',';
    });
    return val.trim().replace(/,*$/, '');
  };

  useEffect(() => {
    logFirebaseCustomEvent(strings.select_past_order, {
      past_order_type: online ? 'favorite' : 'history',
    });

    getRestaurantInfo(vendorid)
      .then(response => {
        setRestauraantAddress(response?.streetaddress + ', ' + response?.city);
        setRestaurantCityState(response?.city + ' - ' + response?.state);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!online) {
      getOrderStatus(id)
        .then(response => {
          setSubTotal(response?.subtotal);
          setEstimateTax(response?.taxes[0]?.tax);
          setTip(response?.tip);
          setTotal(response?.total);
          setDeliveryFee(response?.customerhandoffcharge);
          setServiceFee(response?.fees?.[0]?.amount);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, online]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'order_details_screen',
    });
  }, []);

  const callBack = status => {
    setdelLoading(false);
    if (status === 'success') {
      navigation.goBack();
    }
  };
  const markAsUnFavourite = favId => {
    dispatch(deleteFavOrder(favId, callBack));
  };

  const handleReorder = async () => {
    const isEligibleCallback = products?.length > 1;
    if (online) {
      //fav reorder
      await onFavouriteReorder({faveid: id, ignoreunavailableproducts: false, vendorid}, isEligibleCallback);
    } else {
      const requestBody = {
        orderref: '',
        id: id,
        ignoreunavailableproducts: false,
      };
      onReorder(requestBody, item?.item);
    }
  };
  const onUnFavClick = () => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure about removing this favorite order? Once removed, this record cannot be recovered.',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            logFirebaseCustomEvent(strings.click, {
              click_label: 'yes',
              click_destination: screens.MY_FAVOURITE,
            });
            setdelLoading(true);
            markAsUnFavourite(id);
          },
        },
      ],
    );
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheetModalComponent
        ref={bottomSheetRef}
        onSheetDismiss={() => StatusBar.setBarStyle('dark-content')}
        snapPoints={snapPoints}
        renerBackrop={true}>
        <AddToFavBottomSheet
          bottomSheetRef={bottomSheetRef}
          TitleImage={() => <MyFavIcon70 />}
          title={'Give your favorite order a name!'}
          nickname={Headername?.toString()}
          closeBottomSheet={() => bottomSheetRef?.current?.closeSheet()}
          favOrderId={id}
        />
      </BottomSheetModalComponent>
    );
  };

  const action = action => {
    if (action === 'edit') {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'add_to_favorites',
        click_destination: 'Open Add To Favorites Modal Sheet',
      });
      bottomSheetRef?.current?.openSheet?.();
    } else {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'remove_favorites',
        click_destination: 'Confirmation Dialog',
      });
      online ? onUnFavClick() : bottomSheetRef?.current?.openSheet?.();
    }
  };
  return (
    <>
      <MenuScreenHeader
        showCartIcon={false}
        screenTitle={online ? Headername?.toString()?.toUpperCase() : 'ORDER DETAILS'}
        containerStyle={styles.header}
        route={route}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1, paddingBottom: getMScale(50)}}>
        {!online ? (
          <ImageComponent
            source={images.orderCompletedBg}
            resizeMode={'stretch'}
            style={styles.datebgStyle}>
            <RText
              color={colors.primary}
              size={'sm'}
              weight={'semiBold'}
              text={
                'Order Completed on ' +
                formatDateTime(
                  readytime,
                  constants.TIME_FORMAT.DMY_SLASH_,
                  constants.TIME_FORMAT.YYYYMMDD_HH_mm,
                )
              }
              textStyle={styles.orderCompletedateStyle}
            />
          </ImageComponent>
        ) : null}

        <View>
          {loading ? (
            <RestaurantCardLoader />
          ) : (
            <>
              {!online ? (
                <InfoComponent
                  Image={
                    deliverymode === constants.handOffMode.DISPATCH
                      ? () => <LocationIcon />
                      : () => <PickUpIcon />
                  }
                  titleText={
                    deliverymode === 'pickup' ? strings.pick_up_in_store : strings.delivery_order
                  }
                  titleFontSize={'xs'}
                  titleWeight={'semiBold'}
                  subTitleSize={'xxs'}
                  subTitle={''}
                  btnText={'Change'}
                  hideExtraUI
                  containerStyle={{marginHorizontal: getMScale(16), marginTop: getMScale(16)}}
                  onPress={() => {}}
                />
              ) : null}

              <InfoComponent
                Image={() => <LocationIcon />}
                titleText={resturantCityState}
                titleFontSize={'xs'}
                titleWeight={'semiBold'}
                subTitleSize={'xxs'}
                subTitle={restauraantAddress}
                hideExtraUI
                containerStyle={{
                  marginHorizontal: getMScale(16),
                  marginTop: getMScale(16),
                  justifyContent: 'flex-start',
                  backgroundColor: colors.white,
                }}
              />
            </>
          )}
          <RText
            color={colors.subTitleText}
            size={'xxs'}
            textStyle={styles.infoText}
            text={'To change order type or store location, edit on Checkout screen'}
          />
          {renderGreyHorizontalLine()}
          <RText
            text={products?.length > 1 ? 'Order Items' : 'Order Item'}
            color={colors.primary}
            size={'xs'}
            weight={'semiBold'}
            textStyle={styles.orderItemText}
          />
          {products.map(product => (
            <CartItem
              iconUrl={require('../../assets/images/placeholder.jpeg')}
              title={product?.name?.toString()}
              customization={getOptions(product?.choices)}
              price={product?.totalcost ? '$' + product?.totalcost?.toFixed(2) : ''}
              containerStyle={{marginHorizontal: getMScale(16)}}
              hideQuantityView={true}
            />
          ))}
          {loading ? (
            <OrderPriceLoader />
          ) : (
            <>
              {!online && total !== 0 ? (
                <>
                  <View style={styles.orderTotalWrapper}>
                    <View>
                      <RText
                        text={'Subtotal'}
                        color={colors.primary}
                        size={'xs'}
                        weight={'semiBold'}
                      />
                      <RText
                        text={'Estimated Taxes'}
                        color={colors.primary}
                        size={'xs'}
                        textStyle={styles.estimatedTax}
                      />
                      {deliverymode === 'dispatch' ? (
                        <>
                          <RText
                            text={'Delivery Fee'}
                            color={colors.primary}
                            size={'xs'}
                            textStyle={styles.estimatedTax}
                          />
                          <RText
                            text={'Service Fee'}
                            color={colors.primary}
                            size={'xs'}
                            textStyle={styles.estimatedTax}
                          />
                        </>
                      ) : null}
                      {tip > 0 ? (
                        <RText
                          text={'Tip'}
                          color={colors.primary}
                          size={'xs'}
                          textStyle={styles.estimatedTax}
                        />
                      ) : null}
                    </View>
                    <View>
                      <RText
                        text={'$ ' + subTotal}
                        color={colors.primary}
                        size={'xs'}
                        weight={'semiBold'}
                      />
                      <RText
                        text={'$ ' + estimateTax}
                        color={colors.primary}
                        size={'xs'}
                        textStyle={styles.estimatedTax}
                      />
                      {deliverymode === 'dispatch' ? (
                        <>
                          <RText
                            text={'$ ' + deliveryFee}
                            color={colors.primary}
                            size={'xs'}
                            textStyle={styles.estimatedTax}
                          />
                          <RText
                            text={'$ ' + serviceFee}
                            color={colors.primary}
                            size={'xs'}
                            textStyle={styles.estimatedTax}
                          />
                        </>
                      ) : null}
                      {tip > 0 ? (
                        <RText
                          text={'$ ' + tip}
                          size={'xs'}
                          color={colors.primary}
                          textStyle={styles.estimatedTax}
                        />
                      ) : null}
                    </View>
                  </View>
                  {renderGreyHorizontalLine()}
                  <View style={styles.totalWrapper}>
                    <RText text={'Total'} size={'lg'} weight={'semiBold'} color={colors.primary} />
                    <RText
                      text={'$ ' + total}
                      size={'lg'}
                      weight={'semiBold'}
                      color={colors.primary}
                    />
                  </View>
                </>
              ) : null}
            </>
          )}

          <TouchableOpacity
            accessible
            accessibilityHint={
              online
                ? 'activate remove this order as favorite'
                : 'activate to add this order to favorites.'
            }
            onPress={action}>
            <View style={styles.addToFavWrapper_}>
              {online ? <BlueFilledStar /> : <Star />}
              <RText
                color={colors.secondary}
                size={'xxs'}
                text={online ? 'Remove Favorites' : 'Add to Favorites'}
                textStyle={{marginStart: getMScale(8)}}
              />
            </View>
          </TouchableOpacity>

          <RButton
            accessibilityHint={'activate to re order this previous order'}
            onPress={handleReorder}
            title={strings.reorder}
            disabled={online ? favLoading : reorderLoading}
            loading={online ? favLoading : reorderLoading}
            buttonStyle={styles.reOrderBtn}
          />
        </View>
      </ScrollView>
      {renderBottomSheet()}
      <LoadingOverlay isLoading={delLoading} />
    </>
  );
};
export default OrderDetailScreen;
