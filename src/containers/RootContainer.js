import React, {useEffect} from 'react';
import AppStateHandler from './AppStateHandler';
import DeepLinkHandler from './DeepLinkHandler';
import FlashMessage from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {resetBasketRequest} from '../redux/actions/basket';
import {AccessibilityInfo, ImageBackground, View} from 'react-native';
import {images} from '../assets';
import RText from '../components/RText';
import {colors} from '../theme';
import FlashMessageSuccessIcon from '../assets/svgs/FlashMessageSuccessIcon';
import FlashMessageDangerIcon from '../assets/svgs/FlashMessageDangerIcon';
import {SCREEN_WIDTH} from '../theme/metrics';
import useAuthSelector from '../hooks/reduxStateHooks/useAuthSelector';
import {setUserAccessibilityStatus, userLogout} from '../redux/actions/user';
import NotificationHandler from './NotificationHandler';
import FirebaseConfig from '../configs/FirebaseConfig';
import useBasketSelector from '../hooks/reduxStateHooks/useBasketSelector';
import {removePreviousAddresses} from "../helpers/checkout";
import {updateDuplicateAddress} from "../redux/actions/basket/checkout";

function RootContainer() {
    const {basket, addresses} = useBasketSelector();
    const {address: deliveryAddress} = useSelector(state => state.deliveryAddress);
    // const {isGuest} = useGuestSelector();
    const dispatch = useDispatch();

    const {isSocialSignup} = useAuthSelector();

    //Remove user info if user did not completed social signup
    useEffect(() => {
        if (isSocialSignup) {
            dispatch(userLogout());
        }
    }, []);

    useEffect(() => {
        if (basket?.products?.length === 0) {
            dispatch(resetBasketRequest());
        }
    }, [basket?.products?.length, dispatch]);

    useEffect(() => {
        dispatch(resetBasketRequest());
    }, []);

    useEffect(() => {
        if (addresses?.duplicated?.length) {
            removePreviousAddresses(addresses, deliveryAddress, basket, false);
        }
    }, [basket]);

    //modified
    // useEffect(() => {
    //     const {deliveryaddress} = basket ?? {};
    //     logToConsole({deliveryAddress,duplicated: addresses?.duplicated, deliveryaddress  })
    //     if (
    //         basket &&
    //         deliveryAddress?.id &&
    //         !addresses?.duplicated.includes(deliveryaddress?.id)
    //         // deliveryAddress?.id !== basket?.deliveryaddress?.id
    //     ) {
    //         const updatedDuplicateAddress = [
    //             ...addresses?.duplicated,
    //             basket.deliveryaddress.id,
    //         ];
    //         dispatch(updateDuplicateAddress(updatedDuplicateAddress));
    //     }
    // }, [basket]);



    useEffect(() => {
        if (
            addresses?.duplicated &&
            basket?.deliveryaddress?.id &&
            !addresses?.duplicated.includes(basket?.deliveryaddress?.id) &&
            deliveryAddress?.id !== basket?.deliveryaddress?.id
        ) {
            const updatedDuplicateAddress = [
                ...addresses?.duplicated,
                basket.deliveryaddress.id,
            ];
            dispatch(updateDuplicateAddress(updatedDuplicateAddress));
        }
    }, [basket]);

    useEffect(() => {
        const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
            'screenReaderChanged',
            isScreenReaderEnabled => {
                dispatch(setUserAccessibilityStatus(isScreenReaderEnabled));
            },
        );
        AccessibilityInfo.isScreenReaderEnabled().then(isScreenReaderEnabled => {
            dispatch(setUserAccessibilityStatus(isScreenReaderEnabled));
        });

        return () => {
            screenReaderChangedSubscription.remove();
        };
    }, []);

  const CustomFlashMessage = props => {
      const {message = {}} = props || {};
      const {message: msg = '', type} = message || {};

    const renderFlashMessageIcon = () => {
      switch (type) {
        case 'success':
          return <FlashMessageSuccessIcon />;
        case 'danger':
          return <FlashMessageDangerIcon />;
        default:
          return <FlashMessageSuccessIcon />;
      }
    };

        return (
            <ImageBackground
                source={images.flashMessageBg}
                resizeMode={'stretch'}
                style={{
                    width: SCREEN_WIDTH,
                    bottom: 60,
                    paddingVertical: 22,
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 16,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingHorizontal: 20,
                        borderRadius: 16,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View
                        style={{
                            width: 30,
                            height: 30,
                            backgroundColor: colors.white,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {renderFlashMessageIcon()}
                    </View>
                    <RText
                        text={msg}
                        accessible
                        accessibilityLabel={msg}
                        accessibilityLiveRegion={'assertive'}
                        weight={'semiBold'}
                        textStyle={{marginStart: 10, marginHorizontal: 20}}
                    />
                </View>
            </ImageBackground>
        );
    };
    return (
        <>
            <AppStateHandler />
            <DeepLinkHandler />
            <NotificationHandler />
            <FirebaseConfig />
            <FlashMessage
                position={'bottom'}
                floating
                duration={3000}
                MessageComponent={props => <CustomFlashMessage {...props} />}
            />
        </>
    );
}

export default RootContainer;
