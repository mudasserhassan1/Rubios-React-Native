import {SectionList, StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import useRecentOrdersHook from './useRecentOrdersHook';
import useReorderHook from '../../hooks/useReorderHook';
import RText from '../../components/RText';
import OrderItem from '../../components/OrderItem';
import {constants, screens, strings} from '../../constants';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import AddToFavBottomSheet from './AddToFavBottomSheet';
import MyFavIcon70 from '../../assets/svgs/MyFavIcon70';
import {Screen} from '../../components/Screen';
import {colors} from '../../theme';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import {formatDateTime} from '../../utils/timeUtils';
import OrderInProgressIcon from '../../assets/svgs/OrderInProgressIcon';
import {getMScale} from '../../theme/metrics';
import OrderInProgress from '../../components/OrderInProgress';
import EmptyOrderIcon from '../../assets/svgs/EmptyOrderIcon';
import RButton from '../../components/RButton';
import moment from 'moment';
import {navigateTo} from '../../utils/navigationUtils';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const RecentOrdersScreen = () => {
  const {recentOrders, favOrder, onFavClick, bottomSheetRef, snapPoints, showOrderInProgressView} =
    useRecentOrdersHook();
  const {onReorder, renderLoadingJSX, reorderLoading} = useReorderHook();
  const {cartCount} = useBasketSelector();

  const {
    deliverymode,
    readytime,
    id: orderId,
    status,
    vendorid,
  } = recentOrders?.[0]?.data?.[0] || {};

  const [loadingItem, setLoadingItem] = useState(null);
  const [isReorderPressed, setIsReorderPress] = useState(false);

  const value = deliverymode === 'dispatch' ? 'Delivery' : deliverymode;
  const deliveryModeValue = value?.charAt(0).toUpperCase() + value?.slice(1);
  const stx = deliverymode === 'pickup' ? ' •Requested ' : ' • Estimated ';
  const finalString = deliveryModeValue + stx;

  useEffect(() => {
    if (!reorderLoading) {
      setIsReorderPress(false);
    }
  }, [reorderLoading]);

  const handleReorder = async (item) => {
    setLoadingItem(item?.id);
    setIsReorderPress(true);
    onReorder({id: item?.id, ignoreunavailableproducts: false, orderref: ''}, item);
  };

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'my_orders_screen',
    });
  }, []);

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
          closeBottomSheet={() => bottomSheetRef?.current?.closeSheet()}
          favOrderId={favOrder?.id}
        />
      </BottomSheetModalComponent>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={{marginHorizontal: getMScale(16)}}>
        <OrderItem
          item={item}
          isRecentTab={true}
          onFavClick={() => onFavClick(item)}
          onReorderPress={() => handleReorder(item)}
          loading={loadingItem === item?.id && reorderLoading}
          isReorderPressed={isReorderPressed}

        />
      </View>
    );
  };

  const renderSectionHeader = ({section: {title} = {}}) => {
    return (
      <RText
        text={formatDateTime(title, constants.TIME_FORMAT.monthNameDate_Year, 'MM/DD/YYYY')}
        color={colors.subTitleText}
        size={'xxs'}
        textStyle={styles.dateStyle}
      />
    );
  };

  const NavigateOrderBtn = () => {
    if (cartCount > 0) {
      navigateTo(screens.CART);
    } else {
      navigateTo(screens.CHOOSE_ORDER_TYPE, {comingFromRewards: true});
    }
  };
  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyWrapper}>
        <EmptyOrderIcon />
        <RText
          text={strings.no_order_yet}
          color={colors.subTitleText}
          size={'xxs'}
          textStyle={styles.emptyTextStyle}
        />

        <RButton
          onPress={NavigateOrderBtn}
          title={strings.order_now}
          disabled={false}
          buttonStyle={styles.orderNowBtn}
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
        <ScreenHeader showCartButton={false} title={'My Orders'} />
        {showOrderInProgressView ? (
          <OrderInProgress
            Image={() => <OrderInProgressIcon />}
            titleText={
              status === 'Scheduled' || status === 'In Progress' ? strings.orderInProgress : ''
            }
            titleFontSize={'xs'}
            titleWeight={'bold'}
            subTitleSize={'xxs'}
            subTitle={finalString + moment(readytime, 'YYYYMMDD HH:mm').format('ddd hh:mm A')}
            onEditPress={() =>
              navigateTo(screens.DELIVERY_STATUS, {orderId: orderId, vendorid: vendorid})
            }
            orderInProgress
            containerStyle={{marginVertical: 5, paddingHorizontal: getMScale(5)}}
          />
        ) : null}

        <SectionList
          sections={recentOrders}
          stickyHeaderHiddenOnScroll
          stickySectionHeadersEnabled={false}
          style={{marginTop: getMScale(15)}}
          contentContainerStyle={{paddingBottom: 50}}
          keyExtractor={item => item.readytime}
          ListEmptyComponent={ListEmptyComponent}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
        />
        {renderBottomSheet()}
      </Screen>
      {renderLoadingJSX()}
    </>
  );
};
export default RecentOrdersScreen;
