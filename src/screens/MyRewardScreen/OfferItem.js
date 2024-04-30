import {Platform, TouchableOpacity, View} from "react-native";
import styles from "./styles";
import ImageComponent from "../../components/ImageComponent/ImageComponent";
import RText from "../../components/RText";
import {formatDateTime} from "../../utils/timeUtils";
import {constants} from "../../constants";
import {colors} from "../../theme";
import {getMScale} from "../../theme/metrics";
import React, {useMemo, useRef} from "react";

const OfferItem = ({item, onScanPress, onOrderPress}) => {

    const {reward_image_url: imageUrl, name: title, description, reward} = item || {};
    const {expiring_at: expiryDate } = reward || {};

    //accessibility Refs
    const expiryDateRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();
    const scanButtonRef = useRef();
    const orderButtonRef = useRef();
    const seeAllRef = useRef();
    const accessibilityActions = useMemo(() => {
        const actions = [
            {
                name: 'scan',
                label: 'scan in restaurant'
            },
            {
                name: 'order',
                label: 'order',
            },
            {
                name: 'seeTerms',
                label: 'see terms',
            }
        ]
        return Platform.select({
            ios: actions,
            android: [],
        })
    }, [])

    const handleAccessibilityActions = (event) => {
        switch (event.nativeEvent.actionName) {
            case 'scan':
                onScanPress(item);
                break;
            case 'order':
                onOrderPress();
                break;
            case 'seeTerms':
                onScanPress(item);
                break;
            default:
                break;
        }
    }
    return (
            <View
                accessible
                accessibilityLabel={`${title}`}
                accessibilityHint={'Swipe up or down for more actions'}
                accessibilityValue={{text: `${description}`}}
                accessibilityActions={accessibilityActions}
                onAccessibilityAction={handleAccessibilityActions}
                style={styles.offersItemContainer}>
                <ImageComponent accessible={false} source={{uri: imageUrl}} style={styles.offersImage} resizeMode={'cover'} />
                {expiryDate ? (
                    <View accessible={false} style={styles.expiryDate}>
                        <RText
                            ref={expiryDateRef}
                            text={'Expires: ' + formatDateTime(expiryDate, constants.TIME_FORMAT.MDY_SLASH)}
                            size={'xxs'}
                            textStyle={{fontStyle: 'italic'}}
                            color={colors.expiryDateColor}
                        />
                    </View>
                ) : null}

                <View accessible={false} style={styles.bottomViewWrapper}>
                    <View style={{minHeight: getMScale(45)}}>
                        <RText
                            ref={titleRef}
                            accessibilityRole={'header'}
                            text={title}
                            color={colors.primary}
                            size={'xxs'}
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            weight={'semiBold'}
                            textStyle={{lineHeight: 17.5, letterSpacing: 0.15}}
                        />
                        <RText
                            ref={descriptionRef}
                            text={description}
                            color={colors.primary}
                            size={'xxs'}
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                            textStyle={{lineHeight: 12, letterSpacing: 0.15, marginTop: getMScale(6)}}
                        />
                    </View>
                    <View
                        accessible={false}
                        style={{
                            marginTop: getMScale(15),
                            flexDirection: 'row',
                            marginBottom: getMScale(5),
                            // flexWrap: 'wrap',
                            rowGap: getMScale(10),
                            columnGap: getMScale(4),
                        }}>
                        <TouchableOpacity
                            ref={scanButtonRef}
                            accessible={false}
                            disabled={false}
                            activeOpacity={0.7}
                            style={styles.itemBottomView}
                            onPress={() => onScanPress(item)}>
                                <RText
                                    // allowFontScaling={false}
                                    // maxFontSizeMultiplier={1.2}
                                    color={colors.secondary}
                                    weight={'headerBold'}
                                    text={'Scan In-Restaurant'}
                                    size={'xxs'}
                                />
                        </TouchableOpacity>
                        <TouchableOpacity
                            ref={orderButtonRef}
                            accessible={false}
                            hitSlop={{top: 15, bottom: 15, left: 10, right: 10}}
                            disabled={false}
                            activeOpacity={0.7}
                            style={styles.orderBtnView}
                            onPress={onOrderPress}>
                                <RText
                                    accessible={false}
                                    // maxFontSizeMultiplier={1.2}
                                    color={colors.white}
                                    weight={'headerBold'}
                                    // allowFontScaling={false}
                                    text={'Order'}
                                    size={'xxs'} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        ref={seeAllRef}
                        accessible={false}
                        onPress={() => onScanPress(item)}>
                        <RText
                            text={'See Terms'}
                            color={colors.primaryLink}
                            size={'xxs'}
                            textStyle={{
                                marginTop: getMScale(10),
                                marginBottom: getMScale(15),
                                textDecorationLine: 'underline',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
    )
};

export default OfferItem;
