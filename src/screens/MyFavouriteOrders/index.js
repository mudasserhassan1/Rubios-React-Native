import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import useFavouriteOrdersHook from './useFavouriteOrdersHook';
import RText from '../../components/RText';
import {screens, strings} from '../../constants';
import OrderItem from '../../components/OrderItem';
import LoadingOverlay from '../../components/LoadingComponent/SpinnerOverly';
import {Screen} from '../../components/Screen';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';
import RButton from '../../components/RButton';
import EmptyFavIcon from '../../assets/svgs/EmptyFavIcon';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {navigateTo} from '../../utils/navigationUtils';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import {FlashList} from "@shopify/flash-list";
import useReorderHook from "../../hooks/useReorderHook";
import {logToConsole} from "../../configs";

const FavouriteOrdersScreen = () => {
  const {favOrders, onUnFavClick, loading} = useFavouriteOrdersHook();
  const {cartCount} = useBasketSelector();
    const [isReorderPressed, setIsReorderPressed] = useState(false);
    const [loadingItem, setLoadingItem] = useState(null);

    const {onFavouriteReorder, favLoading} = useReorderHook();

    const handleReorder = async (item) => {
        setIsReorderPressed(true);
        setLoadingItem(item?.id);
        const isEligibleCallback = item?.products?.length > 1;
        await onFavouriteReorder({
            faveid: item.id,
            ignoreunavailableproducts: false,
            vendorid: item.vendorid,
        }, isEligibleCallback);
    };

    useEffect(() => {
        if (!favLoading) {
            setIsReorderPressed(false);
        }
    }, [favLoading]);

    const renderItem = ({item}) => {
    return (
      <OrderItem
        item={item}
        isRecentTab={false}
        onUnFavClick={() => onUnFavClick(item)}
        isFavourite
        isReorderPressed={isReorderPressed}
        onReorderPress={() => handleReorder(item)}
        loading={favLoading && loadingItem === item.id}
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
        <EmptyFavIcon />
        <RText
          text={strings.no_fav_order_yet}
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
      <Screen preset={'fixed'} backgroundColor={colors.white} withHeader>
        <ScreenHeader showCartButton={false} title={'MY FAVORITES'} />
        <FlashList
          keyExtractor={item => String(item?.id)}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{paddingBottom: getMScale(200), paddingHorizontal: getMScale(15)}}
          data={favOrders}
          renderItem={renderItem}
          estimatedItemSize={200}
          extraData={favLoading}
        />
      </Screen>
      <LoadingOverlay isLoading={loading} />
    </>
  );
};

export default FavouriteOrdersScreen;
