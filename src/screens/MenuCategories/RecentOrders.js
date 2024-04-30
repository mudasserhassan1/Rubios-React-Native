import React, {memo, useState} from "react";
import {SectionList, StatusBar, View} from "react-native";
import {getMScale, SCREEN_WIDTH} from "../../theme/metrics";
import OrderItem from "../../components/OrderItem";
import {constants, screens, strings} from "../../constants";
import {colors} from "../../theme";
import useRecentOrdersHook from "../MyOrders/useRecentOrdersHook";
import MyFavouritesGuestIcon from "../../assets/svgs/MyFavouritesGuestIcon";
import RubisBagLargeIcon from "../../assets/svgs/RubisBagLargeIcon";
import RText from "../../components/RText";
import RButton from "../../components/RButton";
import {navigateTo} from "../../utils/navigationUtils";
import useReorderHook from "../../hooks/useReorderHook";
import {formatDateTime} from "../../utils/timeUtils";
import EmptyOrderIcon from "../../assets/svgs/EmptyOrderIcon";
import useBasketSelector from "../../hooks/reduxStateHooks/useBasketSelector";
import BottomSheetModalComponent from "../../components/BottomSheetModal/BottomSheetModalComponent";
import AddToFavBottomSheet from "../MyOrders/AddToFavBottomSheet";
import MyFavIcon70 from "../../assets/svgs/MyFavIcon70";
import styles from './styles';

const RecentOrders = (props) => {
    const [loadingItem, setLoadingItem] = useState(null);
    const [isReorderPressed, setIsReorderPressed] = useState(false);

    const {recentOrders, favOrder, onFavClick, snapPoints, isGuest, bottomSheetRef} =
        props ?? {};
    const {onReorder, reorderLoading} = useReorderHook();
    const {cartCount} = useBasketSelector()

    const handleReorder = (item) => {
        setIsReorderPressed(true);
        setLoadingItem(item.id);
        onReorder({id: item?.id, ignoreunavailableproducts: false, orderref: ''}, item)
    }

    const handleAuthNavigator = screen => {
        setTimeout(() => {
            navigateTo('AuthStack', {
                screen: screen,
                params: {screenName: screens.MENU_CATEGORIES},
            });
        }, 300);
    };


    const renderItem = ({item}) => {
        return (
            <View style={{marginHorizontal: getMScale(2)}}>
                <OrderItem
                    item={item}
                    isRecentTab={true}
                    onFavClick={() => onFavClick(item)}
                    onReorderPress={() => handleReorder(item)}
                    isReorderPressed={isReorderPressed}
                    loading={loadingItem === item?.id && reorderLoading}
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

    if (isGuest) {
        const title = strings.my_orders;
        const subtitle = strings.guest_login_modal_text_my_orders;
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
            <SectionList
                sections={recentOrders}
                stickyHeaderHiddenOnScroll
                style={{marginTop: getMScale(15), width: '93%'}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}
                keyExtractor={item => item.readytime}
                ListEmptyComponent={ListEmptyComponent}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
            />
            {/*{renderBottomSheet()}*/}
        </View>
    );
};

export default memo(RecentOrders);
