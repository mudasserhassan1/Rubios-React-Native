import styles from './styles';

import {colors} from '../../theme';
import {
    Image,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Screen} from '../../components/Screen';
import RewardsHeader from '../../components/RewardsHeader';
import MyRewardsInfo from '../../components/MyRewardsInfo';
import {getMScale, getVerticalScale, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/metrics';
import {images} from '../../assets';
import RText from '../../components/RText';
import moment from 'moment';
import RedemptionItem from './RedemptionItem';
import {screens, strings} from '../../constants';
import useMyRewardsHook from './useMyRewardsHook';
import {useNavigation} from '@react-navigation/native';
import RewardsPlaceholder from './RewardsPlaceholder';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import RButton from '../../components/RButton';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import Animated, {Easing, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import RewardStar from '../../assets/svgs/RewardStar';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {navigateTo} from '../../utils/navigationUtils';
import QRPlaceholder from './QRPlaceholder';
import QRCode from 'react-native-qrcode-svg';
import {useDispatch, useSelector} from 'react-redux';
import MyOffersEmptyComponent from '../../components/MyOffersEmptyComponent';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import {isIos} from '../../utils/sharedUtils';
import {numberToWords} from '../../utils/convertDigitToNumber';
import {clearChallengeDetails} from '../../redux/actions/challenges';
import ChallengesPlaceholder from './ChallengesPlaceholder';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";
import OfferItem from "./OfferItem";
import ChallengeItem from "./ChallengeItem";
import BottomSheetHeader from "../../components/BottomSheetHeader/BottomSheetHeader";

const MyRewardScreen = ({route}) => {
    const navigation = useNavigation();
    const {
        points,
        loadingRewards,
        loadingRedemptions,
        goToQRCode,
        filteredChallenges,
        snapPoints,
        challengesBottomSheetRef,
        getDetails,
        challengeDetail,
        parentProgressWidth,
        challengeSheetSnapPoints,
        challengeSheetSnapPoints1,
        challengeSheetSnapPoints2,
        setTitleText,
        qrcodeBottomSheetRef,
        description,
        rewardsReedeemImage,
        rewardName,
        rewardExpiry,
        setIndex,
        index: tabIndex,
        challengeDetailLoading,
        openOffersQRCodeModal,
        redeemAbles,
        total_point_credits,
        total_debits,
        offers,
    } = useMyRewardsHook();

    const {isAccessibilityOn} = useUserSelector();

    const {redemption, loading1} = useSelector(state => state.redemption);
    const dispatch = useDispatch();
    const flatListRef = useRef();
    const listHeaderRef = useRef();

    useEffect(() => {
        logFirebaseCustomEvent(strings.screen_name_filter, {
            screen_name: 'my_reward_screen',
        });
    }, []);

    const {
        name,
        image_url: image,
        end_date: expiry,
        gift_reason: task,
        description: ChallengeDescription,
        occurrence,
        past_completions,
        progress = [],
    } = challengeDetail || {};
    let challengeDescriptionLength = ChallengeDescription?.length;
    const {completed_steps, total_steps} = progress[0] || [];

    const {cartCount} = useBasketSelector();

    const navigateOnOrderPress = () => {
        if (cartCount > 0) {
            logFirebaseCustomEvent(strings.click, {
                click_label: 'order',
                click_destination: screens.CART,
            });
            navigateTo(screens.CART);
        } else {
            logFirebaseCustomEvent(strings.click, {
                click_label: 'order',
                click_destination: screens.CHOOSE_ORDER_TYPE,
            });
            navigateTo(screens.CHOOSE_ORDER_TYPE, {comingFromRewards: true});
        }
    };

    const renderCollapsableTabBar = () => {
        return (
            <Tabs.Container
                renderTabBar={tabBar}
                renderHeader={Header}
                headerHeight={getMScale(510)}
                onIndexChange={index => {
                    setIndex(index);
                }}>
                <Tabs.Tab
                    name="Rewards"
                    label={() =>
                        <RText
                            text={'Rewards'}
                        />
                    }
                    inactiveColor={colors.subTitleText}>
                    <Tabs.ScrollView
                        nestedScrollEnabled
                        contentContainerStyle={{
                            paddingBottom: isIos ? getMScale(350) : getMScale(100),
                            width: '100%',
                        }}>
                        {renderRewards()}
                    </Tabs.ScrollView>
                </Tabs.Tab>
                <Tabs.Tab name="Challenges" label={() => <RText  text={'Challenges'}/>} inactiveColor={colors.subTitleText}>
                    <Tabs.ScrollView
                        nestedScrollEnabled
                        contentContainerStyle={{
                            paddingBottom: isIos ? getMScale(350) : getMScale(100),
                        }}>
                        {renderChallenges()}
                    </Tabs.ScrollView>
                </Tabs.Tab>
            </Tabs.Container>
        )
    }

    //For accessibility
    const renderCustomTabBar = () => {
        return (
            <View style={{flex: 1}}>
                <Header/>
                <View style={{width: '100%', height: 30, flexDirection: 'row', paddingHorizontal: getMScale(16)}}>
                    {
                        ['Rewards', 'Challenges'].map((item, index) => {
                            const hint = !isSelectedTab ? 'activate to select this tab' : '';
                            const isSelectedTab = tabIndex === index;
                            return (
                                <TouchableOpacity
                                    accessibilityRole={'tab'}
                                    accessibilityState={isIos ? {selected: isSelectedTab} : {}}
                                    accessibilityHint={hint}
                                    onPress={() => setIndex(index)}
                                    style={{
                                        width:'50%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderBottomWidth: isSelectedTab ? 2 : 0
                                    }}>
                                    <RText text={item} weight={isSelectedTab ? 'bold' : 'regular'}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={{flex: 1, flexGrow: 1, paddingTop: getVerticalScale(10)}}>
                    {tabIndex === 0 ? renderRewards() : renderChallenges()}
                </View>
            </View>
        )
    }

    const renderEmptyComponent = () => {
        return (
            <MyOffersEmptyComponent
                titleText={'Your offers are \n' + 'still cooking....'}
                titleFontSize={'xs'}
                titleWeight={'semiBold'}
                containerStyle={{marginVertical: 5, paddingHorizontal: getMScale(5)}}
            />
        );
    };

    const renderOffersItem = ({item}) => (
        <OfferItem
            item={item}
            onScanPress={openOffersQRCodeModal}
            onOrderPress={navigateOnOrderPress}
        />
    );


    const tabBar = props => (
        <MaterialTabBar
            {...props}
            indicatorStyle={{backgroundColor: colors.primary}}
            activeColor={colors.primary}
            inactiveColor={colors.subTitleText}
            labelStyle={{
                fontSize: getMScale(16),
            }}
        />
    );

    const Header = () => {
        return (
            <View style={{marginHorizontal: getMScale(16)}}>
                <RText
                    ref={listHeaderRef}
                    accessible
                    accessibilityRole={'header'}
                    text={'My Offers'}
                    color={colors.primary}
                    weight={'semiBold'}
                    size={'sm'}
                    textStyle={{marginTop: getMScale(10), marginBottom: getMScale(7)}}
                />
                <FlatList
                    ref={flatListRef}
                    horizontal
                    data={offers}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={renderOffersItem}
                    ListEmptyComponent={renderEmptyComponent}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>

        );
    };
    const renderRewardsAndChallenges = () => {
        return (
            <>
                <RewardsHeader
                    screenTitle={'MY REWARDS'}
                    route={route}
                    onRefresh={() =>
                        navigation.navigate(screens.ACCOUNT_HISTORY, {
                            points,
                            total_debits,
                            total_point_credits,
                        })
                    }
                />
                <View style={styles.horizontalLine} />
                <ImageBackground source={images.rewardsBg} style={styles.backgroundParent}>
                    <View style={styles.rewardsInfoWrapper}>
                        <MyRewardsInfo />
                    </View>
                    <ScrollView bounces={false}>
                        <View style={{
                            flex: 1,
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            flexGrow: 1,
                        }}>
                            {renderContent()}
                        </View>
                    </ScrollView>
                </ImageBackground>
            </>
        );
    };

    const renderContent = () => {
        if (isAccessibilityOn) {
            return (
                <>{renderCustomTabBar()}</>
            )
        }
        return <>{renderCollapsableTabBar()}</>
    }
    const renderRedeemItem = ({item, index}) => {
        const {
            redeemable_id: id,
            points_required_to_redeem: rewardsPoints,
            name,
            redeemable_image_url: image,
            description,
        } = item || {};
        return (
            <RedemptionItem
                key={String(item.id || index)}
                item={item}
                points={points}
                onItemPress={() =>
                    goToQRCode(id, name, 'redeemable', points >= rewardsPoints, image, description)
                }
                disabled={!(points >= rewardsPoints)}
                activeOpacity={rewardsPoints ? 1 : 0}
            />
        );
    };

    const renderRewards = () => {
        return (
            <FlatList
                data={redeemAbles}
                ListEmptyComponent={() => {
                    if (loadingRedemptions || loadingRewards) {
                        return <RewardsPlaceholder />
                    }
                }}
                keyExtractor={item => item.redeemable_id.toString()}
                renderItem={renderRedeemItem}
            />
        );
    };

    const openChallengeDetailSheet = challenge => {
        challengesBottomSheetRef?.current?.openSheet?.();
        setTitleText(challenge?.name);
        getDetails(challenge?.challenge_id);
    };

    const renderChallenges = () => {
        return (
            <View style={styles.ChallengesParent}>
                {filteredChallenges?.length === 0 ? (
                    <View style={styles.emptyChallengeView}>
                        <ImageComponent source={images.emptyChallengeIcon} style={styles.emptyChallengeIcon_} />
                        <RText
                            text={'No challenges available for now,\n check back later!'}
                            color={colors.primary}
                            size={'xs'}
                            textStyle={styles.emtyTextStyle}
                        />
                    </View>
                ) : (
                    filteredChallenges?.map(challenge => {
                        return (
                            <ChallengeItem
                                item={challenge}
                                onOrderPress={navigateOnOrderPress}
                                onViewDetailsPress={openChallengeDetailSheet}/>
                        );
                    })
                )}
            </View>
        );
    };

    const renderChallengeDetailSheet = () => {
        return (
            <BottomSheetModalComponent
                ref={challengesBottomSheetRef}
                snapIndex={0}
                onSheetDismiss={() => dispatch(clearChallengeDetails())}
                snapPoints={
                    ChallengeDescription?.length <= 130
                        ? challengeSheetSnapPoints
                        : ChallengeDescription?.length <= 200
                            ? challengeSheetSnapPoints1
                            : ChallengeDescription?.length <= 350
                                ? challengeSheetSnapPoints2
                                : challengeSheetSnapPoints
                }
                hideHandleBar={true}>
                <BottomSheetScrollView
                    bounces={false}
                    contentContainerStyle={{
                        paddingBottom: challengeDescriptionLength > 500 ? getMScale(50) : 0,
                    }}>
                    <BottomSheetHeader
                        title={'challenge details'}
                        onClose={() => {
                            dispatch(clearChallengeDetails());
                            challengesBottomSheetRef?.current?.closeSheet();
                        }}
                    />
                    {renderChallengeDetails()}
                </BottomSheetScrollView>
            </BottomSheetModalComponent>
        );
    };

    const getDotsBackgroundColor = useCallback(
        index => {
            if (activeWidth < 100 * index + 5) {
                return '#82959E';
            }
            return colors.primary;
        },
        [activeWidth],
    );
    const activeWidth = useMemo(() => {
        let factor = 0;
        const barWidth = SCREEN_WIDTH * 0.91;
        if (occurrence === 'single' && past_completions >= 1) {
            return barWidth;
        } else if (completed_steps > 0) {
            factor = completed_steps / total_steps;
            return barWidth * factor;
        } else {
            return 1;
        }
    }, [total_steps]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(activeWidth, {
                duration: 1000, // Animation duration in milliseconds
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Easing function (cubic-bezier)
            }),
        };
    }, [activeWidth]);

    // eslint-disable-next-line no-shadow
    const showText = (completed_steps, total_steps) => {
        if (completed_steps === total_steps || (occurrence === 'single' && past_completions >= 1)) {
            return 'Congratulations! You have completed this challenge!.';
        } else if (completed_steps === 0) {
            return 'Start this challenge by ordering an item!';
        } else {
            return `${completed_steps === 1 ? 'One' : numberToWords(completed_steps)} done! ${
                total_steps - completed_steps
            } to go!`;
        }
    };

    const renderChallengeDetails = () => {
        return (
            <View>
                {challengeDetailLoading ? (
                    <ChallengesPlaceholder />
                ) : (
                    <>
                        <ImageComponent
                            accessible={false}
                            // accessibilityHint={'Challenge Image'}
                            source={{uri: image}}
                            style={{height: getMScale(196), width: SCREEN_WIDTH}}
                            resizeMode={'cover'}
                        />
                        <View style={styles.detailsWrapper}>
                            <RText
                                text={name}
                                accessibilityRole={'header'}
                                size={'lg'}
                                weight={'bold'}
                                textStyle={{lineHeight: 24, width: '60%'}}
                                color={colors.primary}
                            />
                            <RText
                                accessible={!!expiry}
                                text={expiry ? 'Expires ' + moment(expiry).format('M/DD') : ''}
                                size={'xs'}
                                textStyle={{
                                    lineHeight: 17.5,
                                    width: '35%',
                                    fontStyle: 'italic',
                                    textAlign: 'right',
                                }}
                                color={colors.subTitleText}
                            />
                        </View>
                        <Animated.View
                            onLayout={event => (parentProgressWidth.current = event.nativeEvent.layout.width)}
                            style={styles.rewardsProgressContainer}>
                            <View style={styles.dotsContainer}>
                                {Array.from({length: total_steps + 1}, (v, i) => i).map((item, index) => {
                                    return (
                                        <View
                                            key={String(index)}
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: 8,
                                                backgroundColor: getDotsBackgroundColor(item),
                                                alignSelf: 'center',
                                            }}
                                        />
                                    );
                                })}
                            </View>
                            <Animated.View style={[styles.activeLineAndStarContainer, animatedStyle]}>
                                <View style={[styles.star, activeWidth === 0 && {top: -15}]}>
                                    <RewardStar />
                                </View>
                            </Animated.View>
                        </Animated.View>
                        <RText
                            text={ChallengeDescription}
                            color={colors.primary}
                            size={'xs'}
                            textStyle={styles.descriptionTextStyle}>
                            {' '}
                        </RText>
                        <RText textStyle={styles.statusTextStyle}>
                            {' '}
                            {`${showText(completed_steps, total_steps)}`}{' '}
                        </RText>
                        <RButton
                            onPress={() => navigation.navigate(screens.CHOOSE_ORDER_TYPE)}
                            title={
                                completed_steps === total_steps ||
                                (occurrence === 'single' && past_completions >= 1)
                                    ? strings.challenge_Completed
                                    : strings.start_order
                            }
                            disabled={
                                completed_steps === total_steps ||
                                (occurrence === 'single' && past_completions >= 1)
                            }
                            buttonStyle={styles.orderNowBtn}
                        />
                    </>
                )}
            </View>
        );
    };

    const renderRewardQRCodeBottomSheet = () => {
        return (
            <BottomSheetModalComponent
                ref={qrcodeBottomSheetRef}
                snapPoints={snapPoints}
                snapIndex={0}
                hideHandleBar={true}>
                <BottomSheetHeader title={'enjoy, You earned it!'} onClose={() => qrcodeBottomSheetRef?.current?.closeSheet()}/>
                {renderUI()}
            </BottomSheetModalComponent>
        );
    };

    const renderUI = () => {
        if (
            redemption &&
            (redemption.internal_tracking_code || redemption.redemption_tracking_code) &&
            name !== ''
        ) {
            return (
                <BottomSheetScrollView
                    bounces={false}
                    contentContainerStyle={{paddingBottom: getMScale(100)}}>
                    <ImageBackground source={images.rewardsBg} style={styles.imageBackground}>
                        <ImageComponent source={{uri: rewardsReedeemImage}} style={styles.topImage} />
                    </ImageBackground>
                    {loading1 ? (
                        <QRPlaceholder />
                    ) : (
                        <View style={styles.qrParent}>
                            <View
                                accessible
                                // accessibilityRole={'image'}
                                accessibilityLabel={'QR code, image'}
                                style={styles.qrcodeContainer}>
                                <View>
                                    <QRCode size={220} value={redemption?.redemption_tracking_code} />
                                </View>
                                <RText
                                    text={redemption?.redemption_tracking_code}
                                    color={colors.primary}
                                    textStyle={styles.code}
                                />
                            </View>
                            <RText
                                accessibilityRole={'header'}
                                text={rewardName}
                                color={colors.primary}
                                size={'lg'}
                                weight={'bold'}
                                textStyle={{
                                    textAlign: 'center',
                                    marginHorizontal: getMScale(40),
                                    marginTop: getMScale(30),
                                }}
                            />
                            {rewardExpiry ? (
                                <RText
                                    text={'Expires: ' + moment(rewardExpiry).format('MM/DD/YYYY')}
                                    color={colors.subTitleText}
                                    size={'xxs'}
                                    textStyle={{
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                        marginVertical: getMScale(20),
                                    }}
                                />
                            ) : null}

                            <RText
                                text={description}
                                color={colors.subTitleText}
                                size={'xxs'}
                                textStyle={{
                                    textAlign: 'center',
                                    marginHorizontal: getMScale(20),
                                    marginTop: getMScale(20),
                                }}
                            />
                        </View>
                    )}
                </BottomSheetScrollView>
            );
        }
        return null;
    };
    return (
        <Screen
            preset={'fixed'}
            backgroundColor={colors.white}
            withHeader
            contentContainerStyle={{flex: 1}}>
            {renderRewardsAndChallenges()}
            {renderChallengeDetailSheet()}
            {renderRewardQRCodeBottomSheet()}
        </Screen>
    );
};
export default MyRewardScreen;
