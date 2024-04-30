import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import {FlatList, StatusBar, View} from "react-native";
import {getMScale, SCREEN_WIDTH} from "../../theme/metrics";
import OrderItem from "../../components/OrderItem";
import {screens, strings} from "../../constants";
import {colors} from "../../theme";
import EmptyFavIcon from "../../assets/svgs/EmptyFavIcon";
import RText from "../../components/RText";
import RButton from "../../components/RButton";
import useFavouriteOrdersHook from "../MyFavouriteOrders/useFavouriteOrdersHook";
import useReorderHook from "../../hooks/useReorderHook";
import {navigateTo} from "../../utils/navigationUtils";
import useBasketSelector from "../../hooks/reduxStateHooks/useBasketSelector";
import MyFavouritesGuestIcon from "../../assets/svgs/MyFavouritesGuestIcon";
import RubisBagLargeIcon from "../../assets/svgs/RubisBagLargeIcon";
import useAuthSelector from "../../hooks/reduxStateHooks/useAuthSelector";
import styles from './styles'

const Favourites = () => {
    const [loadingItem, setLoadingItem] = useState(null);
    const [isReorderPressed, setIsReorderPressed] = useState(false);

    const {favOrders, onUnFavClick} = useFavouriteOrdersHook();
    const {onFavouriteReorder, reorderLoading, favLoading} = useReorderHook();
    const {cartCount} = useBasketSelector();
    const {isLoggedIn} = useAuthSelector();

    useEffect(() => {
        if (!favLoading) {
            setIsReorderPressed(false);
        }
    }, [reorderLoading]);

    const handleFavReorder = async (item) => {
        setIsReorderPressed(true);
        setLoadingItem(item.id);
        await onFavouriteReorder(
            {
                faveid: item.id,
                ignoreunavailableproducts: false,
                vendorid: item.vendorid,
            },
            item?.products?.length > 1,
        )
    }

    const handleAuthNavigator = screen => {
        setTimeout(() => {
            navigateTo('AuthStack', {
                screen: screen,
                params: {screenName: screens.MENU_CATEGORIES},
            });
        }, 300);
    };

    const renderFavItem = ({item}) => {
        return (
            <View style={{marginHorizontal: getMScale(2)}}>
                <OrderItem
                    item={item}
                    isRecentTab={false}
                    onUnFavClick={() => onUnFavClick(item)}
                    onReorderPress={() => handleFavReorder(item)}
                    isReorderPressed={isReorderPressed}
                    loading={loadingItem === item?.id && favLoading}
                    isFavourite
                />
            </View>
        );
    };

    const NavigateOrderBtn = () => {
        if (cartCount > 0) {
            navigateTo(screens.CART);
        } else {
            navigateTo(screens.CHOOSE_ORDER_TYPE, {comingFromRewards: true});
        }
    };

    const ListFavEmptyComponent = () => {
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

    const renderTabsForGuestUser = (title, subtitle) => {
        return (
            <View
                style={{
                    backgroundColor: colors.white,
                    width: SCREEN_WIDTH,
                    alignItems: 'center',
                    // justifyContent: 'center',
                }}>
                <View style={styles.modalTopImageStyle}>
                    {title === strings.my_fav ? <MyFavouritesGuestIcon /> : <RubisBagLargeIcon />}
                </View>
                <RText
                    text={title}
                    color={colors.primary}
                    weight={'headerBold'}
                    size={'lg'}
                    textStyle={styles.titleTextStyle}
                />
                <RText
                    text={subtitle}
                    color={colors.primary}
                    weight={'regular'}
                    size={'sm'}
                    textStyle={styles.descriptionText}
                />
                <RButton
                    accessibilityHint={'activate to go to signup screen'}
                    onPress={() => handleAuthNavigator(screens.SIGNUP)}
                    title={strings.create_an_account}
                    disabled={false}
                    buttonStyle={styles.createAccountBtn}
                />
                <RText
                    accessibilityRole={'link'}
                    accessibilityHint={'activate to go to login screen'}
                    onPress={() => handleAuthNavigator(screens.SIGN_IN)}
                    textStyle={styles.signupText}>
                    <RText text={`${strings.already_a_member}  `} />
                    <RText
                        text={strings.login_}
                        color={colors.primaryLink}
                    />
                </RText>
            </View>
        );
    };

    if (!isLoggedIn) {
        const title = strings.my_fav;
        const subtitle = strings.guest_login_modal_text_my_fav;
        return renderTabsForGuestUser(title, subtitle);
    }
    return (
        <View
            style={{
                backgroundColor: colors.white,
                width: SCREEN_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <FlatList
                keyExtractor={item => String(item?.item?.id)}
                ListEmptyComponent={ListFavEmptyComponent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: getMScale(50)}}
                data={favOrders}
                style={{width: '93%'}}
                renderItem={renderFavItem}
            />
        </View>
    );
};
export default memo(Favourites)
