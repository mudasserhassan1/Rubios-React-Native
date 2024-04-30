import {Image, Platform, TouchableOpacity, View} from "react-native";
import styles from "./styles";
import {getMScale} from "../../theme/metrics";
import RText from "../../components/RText";
import {colors} from "../../theme";
import moment from "moment/moment";
import React, {useMemo} from "react";

const ChallengeItem = ({item, onOrderPress, onViewDetailsPress}) => {
    const {
        name: challengeName,
        end_date: challengeExpiry,
        image_url: challengeImage,
        id,
    } = item || {};

    const accessibilityActions = useMemo(() => {
        const actions = [
            {
                name: 'order',
                label: 'order',
            },
            {
                name: 'viewDetails',
                label: 'view details'
            },
        ]
        return Platform.select({
            ios: actions,
            android: [],
        })
    }, [])

    const handleAccessibilityActions = (event) => {
        switch (event.nativeEvent.actionName) {
            case 'viewDetails':
                onViewDetailsPress();
                break;
            case 'order':
                onOrderPress();
                break;
            default:
                onViewDetailsPress();
                break;
        }
    }

    return (
        <TouchableOpacity
            accessible={true}
            accessibilityActions={accessibilityActions}
            onAccessibilityAction={handleAccessibilityActions}
            accessibilityLabel={challengeName}
            accessibilityHint={'Swipe up or down for more actions'}
            accessibilityValue={{text: challengeExpiry ? `Expires on ${moment(challengeExpiry).format('M/DD')}`: ''}}
            onPress={() => onViewDetailsPress(item)}>
            <View style={styles.challengeItemContainer} key={id}>
                <Image
                    accessible={false}
                    source={{uri: challengeImage}}
                    resizeMode={'cover'}
                    style={styles.challengeImage}
                />
                <View style={{width: '70%', marginStart: getMScale(16)}}>
                    <RText
                        accessible={false}
                        text={challengeName}
                        numberOfLines={3}
                        color={colors.primary}
                        size={'xs'}
                        weight={'semiBold'}
                        ellipsizeMode={'tail'}
                        textStyle={styles.challengeTitle}
                    />
                    <RText
                        accessible={false}
                        text={
                            challengeExpiry ? 'Expires ' + moment(challengeExpiry).format('M/DD') : ''
                        }
                        color={colors.subTitleText}
                        size={'xs'}
                        ellipsizeMode={'tail'}
                        textStyle={{fontStyle: 'italic', marginTop: getMScale(6)}}
                    />
                    <View style={styles.btnView}>
                        <TouchableOpacity
                            accessible={false}
                            accessibilityRole={'button'}
                            accessibilityHint={'activate to go to choose order type screen'}
                            disabled={false}
                            activeOpacity={0.7}
                            onPress={onOrderPress}>
                            <View style={styles.orderChallengeBtnView}>
                                <RText
                                    color={colors.white}
                                    weight={'headerBold'}
                                    text={'Order'}
                                    size={'xxs'}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={false}
                            accessibilityRole={'link'}
                            accessibilityHint={'activate to open challenge details modal'}
                            onPress={() => onViewDetailsPress(item)}>
                            <RText
                                text={'View Details'}
                                color={colors.primaryLink}
                                size={'xxs'}
                                textStyle={{marginStart: getMScale(20), textDecorationLine: 'underline'}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default ChallengeItem;