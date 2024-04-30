import * as React from 'react';
import {StyleSheet, Animated, Platform, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {goBack} from '../../utils/navigationUtils';
import {colors} from '../../theme';
import BackImage from '../../assets/svgs/BackImage';
import CircularIcon from '../../components/CircularIcon/CircularIcon';
import CartIcon from '../../assets/svgs/CartIcon';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import RText from '../../components/RText';
import {forwardRef, useRef, useState} from 'react';
import {isIos} from '../../utils/sharedUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../../constants';
import AccessibilityWrapper from "../../components/AccessibilityWrapper/AccessibilityWrapper";

const AccessibilityProductHeader = forwardRef(({}, ref) => {
    const {top} = useSafeAreaInsets();
    const Header_Min_Height = isIos ? top + 55 : top + 65;

    const {cartCount} = useBasketSelector();

    const goToBackScreen = () => {
        logFirebaseCustomEvent(strings.click, {
            click_label: 'backIcon',
            click_destination: screens.MENU,
        });
        goBack();
    };
    return (
            <View
                ref={ref}
                style={[
                    styles.header,
                    {
                        ...Platform.select({
                            ios: {
                                paddingTop: top,
                            },
                            android: {
                                paddingTop: top + 10,
                                elevation: 0,
                            },
                        }),
                        height: Header_Min_Height,
                        backgroundColor: 'transparent',
                        paddingBottom: 10,
                    },
                ]}>
                    <CircularIcon
                        type={'svg'}
                        onPress={goToBackScreen}
                        withShadow={false}
                        SVGComponent={() => <BackImage />}
                        style={{backgroundColor: colors.white}}
                        accessible={true}
                        accessibilityLabel={'Back'}
                        accessibilityHint={'activate to go to previous screen'}
                    />
                    <CircularIcon
                        type={'svg'}
                        SVGComponent={() => <CartIcon />}
                        accessibilityLabel={'Shopping Bag'}
                        accessibilityHint={'activate to open Shopping bag Screen'}
                        withShadow={false}
                        countIndicator={cartCount}
                    />
            </View>
    );
});
export default AccessibilityProductHeader;

const styles = StyleSheet.create({
    header: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        left: 0,
        right: 0,
        paddingTop: 10,
        position: 'absolute',
        top: 0,
        zIndex: 1,
        flexDirection: 'row',
        paddingHorizontal: 15,

    },
    headerShadow: {
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.0,
        shadowColor: colors.black,
    },
    headerText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2.0,
        shadowColor: colors.black,
    },
    icon: {width: 20, height: 20},
});
