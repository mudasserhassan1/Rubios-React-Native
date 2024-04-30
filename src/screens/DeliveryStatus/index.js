import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {colors} from '../../theme';
import MenuScreenHeader from '../../components/MenuScreenHeader/MenuScreenHeader';
import {Screen} from '../../components/Screen';
import styles from './styles';
import MapView, {
  Callout,
  CalloutSubview,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {BackHandler, Linking, Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import RText from '../../components/RText';
import {getMScale} from '../../theme/metrics';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import {logToConsole} from '../../configs';
import moment from 'moment/moment';
import {constants, screens, strings} from '../../constants';
import Placeholder from './Placeholder';
import AddressCardLoader from './AddressCardLoader';
import {checkIfLocationPermissionEnabled} from '../../utils/permissionsUtils';
import {getCurrentLocation} from '../../utils/sharedUtils';
import {useFocusEffect} from '@react-navigation/native';
import {moveToPreviousScreenWithMerge, navigateTo} from '../../utils/navigationUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import axiosOloInstance from '../../services/axiosInterceptor';
import {useDispatch} from 'react-redux';
import {submitBasketSinglePaymentSuccess} from '../../redux/actions/basket/checkout';
import useGuestSelector from "../../hooks/reduxStateHooks/useGuestSelector";

const ORDER_STATUSES = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const DeliveryStatus = ({route, navigation}) => {
  const [loading, setLoading] = useState(true);
  const [mCamera, setMCamera] = useState({
    altitude: 0,
    center: {latitude: 0, longitude: 0},
    heading: 0,
    pitch: 0,
    zoom: 12,
  });
  const [orderDetail, setOrderDetail] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [userLocation, setUserLocation] = useState({
    center: {latitude: 0, longitude: 0},
  });

  const {
    orderId,
    vendorid,
    fromScreen,
    deliveryMode = '',
    fromCheckout = false,
  } = route.params || {};
  const {
    deliverymode: orderDeliveryMode = '',
    vendorname = '',
    readytime: orderDeliveryTime = new Date(),
    deliveryaddress = {},
    status: deliveryStatus = '',
  } = orderDetail;

  const {
    streetaddress = '',
    building = '',
    city = '',
    state = '',
    latitude,
    longitude,
  } = restaurant || {};

  const {isGuest} = useGuestSelector();
  const deliverymode = orderDeliveryMode || deliveryMode;

  const dispatch = useDispatch();
  const {restaurantAddress, restaurantCityAndState} = useMemo(() => {
    return {
      restaurantAddress: `${streetaddress}${building ? ', ' + building : ''}`,
      restaurantCityAndState: `${city}, ${state}`,
    };
  }, [building, city, state, streetaddress]);

  const deliveryAddressString = useMemo(() => {
    const {streetaddress, building, zipcode, city} = deliveryaddress || {};
    return `${streetaddress}, ${building ? building + ', ' : ''}${city}, ${zipcode}`;
  }, [deliveryaddress]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'delivery_status_screen',
    });
  }, []);

  useEffect(() => {
    if (fromCheckout) {
      dispatch(submitBasketSinglePaymentSuccess());
    }
  }, [fromCheckout]);

  useEffect(() => {
    if (latitude && longitude) {
      setMCamera(prevState => ({
        ...prevState,
        center: {latitude, longitude},
        zoom: 12,
      }));
    }
  }, [latitude, longitude]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (fromScreen === screens.CHECKOUT) {
          moveToPreviousScreenWithMerge('Home');
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [fromScreen]),
  );

  useEffect(() => {
    if (fromScreen === screens.CHECKOUT) {
      navigation.setOptions({
        gestureEnabled: false,
      });
    }
  }, [navigation, fromScreen]);

  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;

  useEffect(() => {
    if (deliverymode === constants.handOffMode.DISPATCH) {
      checkIfLocationPermissionEnabled().then(res => {
        const {isGranted} = res;
        if (isGranted) {
          handleGetLocation();
        }
      });
    }
  }, [deliverymode]);

  const handleGetLocation = () => {
    getCurrentLocation()
      .then(result => {
        if (result === 'denied') {
          logToConsole('denied');
        } else {
          setUserLocation(prevState => ({
            ...prevState,
            center: {latitude: result?.latitude, longitude: result?.longitude},
          }));
        }
      })
      .catch(err => {
        logToConsole({getCurrLocation: err.message});
      });
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await Promise.all([
        axiosOloInstance.get(`/restaurants/${vendorid}`),
        axiosOloInstance.get(`/orders/${orderId}`),
      ]);
      const data = await Promise.all(res.map(r => r.data));
      setOrderDetail(data[1]);
      setRestaurant(data[0]);
    } catch (e) {
      throw Error(e.response);
    }
  }, [orderId, vendorid]);

  useEffect(() => {
    fetchData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [fetchData]);

  const openMap_ = () => {
    const scheme = Platform.select({ios: 'maps://0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${latitude},${longitude}`;
    const label = restaurant?.name || '';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url)
      .then(() => {})
      .catch(error => console.error('Error opening map app: ', error));
  };

  const renderDottedLine = () => {
    if (userLocation.center?.latitude !== 0 && mCamera?.center?.latitude !== 0) {
      const coordinates = [
        {latitude: userLocation?.center?.latitude, longitude: userLocation?.center?.longitude},
        {latitude: mCamera?.center?.latitude, longitude: mCamera?.center?.longitude},
      ];
      return (
        <Polyline
          coordinates={coordinates}
          strokeColor={colors.dottedLineColor} // Color of the line
          strokeWidth={3}
          lineCap={'round'}
          lineJoin={'bevel'}
          lineDashPattern={[50, 50]}
          strokePattern={[1, 4]} // Pattern: 1 opaque, 4 transparent
        />
      );
    }
    return null;
  };

  const orderStatusImage = useMemo(() => {
    if (deliverymode === constants.handOffMode.PICKUP) {
      switch (deliveryStatus) {
        case ORDER_STATUSES.SCHEDULED:
          return images.orderTrack1;
        case ORDER_STATUSES.IN_PROGRESS:
          return images.orderTrack2;
        case ORDER_STATUSES.COMPLETED:
          return images.orderTrack3;
        default:
          return null;
      }
    }
    if (deliverymode === constants.handOffMode.DISPATCH) {
      switch (deliveryStatus) {
        case ORDER_STATUSES.SCHEDULED:
          return images.deliveryOrderTrack1;
        case ORDER_STATUSES.IN_PROGRESS:
          return images.deliveryOrderTrack2;
        case ORDER_STATUSES.COMPLETED:
          return images.deliveryOrderTrack4;
        default:
          return null;
      }
    }
  }, [deliveryStatus, deliverymode]);

  const GuestTextComponent = () => {
    if (isGuest) {
      return (
          <>
            <RText weight={'bold'} onPress={() => isGuest ? navigateTo('AuthStack', {
              screen: screens.SIGNUP
            }) : null} textStyle={{textDecorationLine: 'underline', color: colors.primaryLink, textTransform: 'uppercase'}}>Sign Up
            </RText>
            <RText weight={'bold'} textStyle={{textTransform: 'uppercase'}}> to Collect points for future order</RText>
          </>
      )
    }
    return null;
  }
  return (
    <Screen
      preset={'fixed'}
      backgroundColor={colors.white}
      withHeader
      contentContainerStyle={{flex: 1}}>
      <MenuScreenHeader
        showCartIcon={false}
        screenTitle={
          deliverymode === 'pickup'
            ? 'PICK UP ORDER'
            : deliverymode === constants.handOffMode.DISPATCH
            ? 'DELIVERY ORDER'
            : ''
        }
        containerStyle={styles.header}
        route={route}
      />
      <ScrollView>
        <View
          style={[
            styles.mapContainer,
            {
              height:
                deliverymode === constants.handOffMode.DISPATCH ? getMScale(235) : getMScale(140),
            },
          ]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            cacheEnabled={false}
            loadingIndicatorColor={colors.primary}
            style={styles.map}
            minZoomLevel={7}
            showsUserLocation
            zoomControlEnabled={false}
            camera={mCamera}>
            <Marker icon={require('./smallicon.png')} coordinate={mCamera?.center}>
              <Callout accessible accessibilityHint={'activate to open map app'} onPress={openMap_}>
                <CalloutSubview onPress={openMap_}>
                  <RText>{vendorname}</RText>
                </CalloutSubview>
              </Callout>
            </Marker>
            {userLocation && deliverymode === constants.handOffMode.DISPATCH ? (
              <Marker icon={require('./location.png')} coordinate={userLocation?.center} />
            ) : null}
            {deliverymode === constants.handOffMode.DISPATCH ? renderDottedLine() : null}
          </MapView>
        </View>
        <View style={styles.adressDetailWrapper}>
          {loading ? (
            <AddressCardLoader />
          ) : (
            <RText
              color={colors.primary}
              text={
                deliverymode === 'pickup'
                  ? 'Order will be ready on ' +
                    moment(orderDeliveryTime, 'YYYYMMDD HH:mm').format('dddd, MMMM D,') +
                    ' approximately ' +
                    moment(orderDeliveryTime, 'YYYYMMDD HH:mm').format('h:mm A')
                  : 'Estimated Delivery time:\n' +
                    moment(orderDeliveryTime, 'YYYYMMDD HH:mm').format('dddd, MMMM D, h:mm A')
              }
              size={'sm'}
              weight={'bold'}
              textStyle={styles.deliveryTimeStyle}
            />
          )}
        </View>
        {loading ? (
          <AddressCardLoader />
        ) : (
          <TouchableOpacity activeOpacity={1} onPress={openMap_}>
            <View style={styles.addressContainer}>
              <View>
                <RText
                  text={
                    deliverymode === 'pickup' ? restaurantCityAndState : strings.delivery_address
                  }
                  color={colors.primary}
                  weight={'semiBold'}
                  size={'xs'}
                />
                <RText
                  text={
                    deliverymode === constants.handOffMode.DISPATCH
                      ? deliveryAddressString
                      : restaurantAddress
                  }
                  color={
                    deliverymode === constants.handOffMode.PICKUP
                      ? colors.secondary
                      : colors.primary
                  }
                  size={'xxs'}
                  textStyle={
                    deliverymode === constants.handOffMode.PICKUP
                      ? styles.addressStyle
                      : styles.addressStyle_
                  }
                />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {renderGreyHorizontalLine()}
        {deliverymode === 'pickup' ? (
          <View style={styles.pickupPointsTextWrapper}>
            <ImageComponent style={styles.pickupRewardImageStyle} source={images.startWithBG} />
            <RText
                text={isGuest ? '' : strings.rewards_are_on_the_way}
                size={'sm'}
                weight={'bold'}
                color={colors.primary}
                textStyle={{
                  marginHorizontal: getMScale(isGuest ? 80 : 116),
                  textAlign: 'center',
                  lineHeight: 20,
                  marginTop: getMScale(20),
                  textTransform: 'uppercase'
                }}
            >
              <GuestTextComponent/>
            </RText>

          </View>
        ) : (
          <View style={styles.deliveryPointsTextWrapper}>
            <ImageComponent style={styles.deliveryRewardImageStyle} source={images.startWithBG} />
            <RText
                text={isGuest ? '' : strings.points_are_on_the_way}
                size={'sm'}
                weight={'bold'}
                color={colors.primary}
                textStyle={{
                  textAlign: 'center',
                  lineHeight: 20,
                  marginStart: getMScale(10),
                  textTransform: 'uppercase'
                }}
            >
              <GuestTextComponent/>
            </RText>
          </View>
        )}

        <View style={styles.orderStatusView}>
          {loading ? (
            <AddressCardLoader />
          ) : (
            <>
              <RText
                text={deliverymode === 'pickup' ? 'PICK UP STATUS' : 'DELIVERY STATUS'}
                color={colors.primary}
                size={'lg'}
                weight={'bold'}
                textStyle={styles.orderStatusTextStyle}
              />
              <RText
                text={deliverymode === 'pickup' ? strings.pickupOrder : strings.deliveryOrder}
                color={colors.subTitleText}
                size={'xxs'}
                textStyle={styles.orderStatusTextStyle_}
              />
            </>
          )}

          {renderGreyHorizontalLine()}
          {loading ? (
            <Placeholder />
          ) : (
            <ImageComponent source={orderStatusImage} style={styles.deliveryStatusImageStyle} />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default DeliveryStatus;
