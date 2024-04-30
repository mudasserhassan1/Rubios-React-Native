import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {screens, strings} from '../../constants';
import styles from './styles';
import RText from '../../components/RText';
import React, {useMemo} from 'react';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';
import {navigateTo} from '../../utils/navigationUtils';
import {isIos} from "../../utils/sharedUtils";

const RedemptionItem = ({item, onItemPress, disabled = false, key}) => {
  const {redeemable_image_url: image = '', points_required_to_redeem, name = ''} = item || {};

  const text = `${points_required_to_redeem || 0} ${strings.points}`;

    const onOrderPress = () => navigateTo(screens.CHOOSE_ORDER_TYPE, {comingFromRewards: true});

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
        ]
        return Platform.select({
            ios: actions,
            android: [],
        })
    }, [])

    const handleAccessibilityActions = (event) => {
        switch (event.nativeEvent.actionName) {
            case 'scan':
                onItemPress();
                break;
            case 'order':
                onOrderPress();
                break;
            default:
                onItemPress();
                break;
        }
    }

  return (
        <View
            accessible={true}
            accessibilityActions={accessibilityActions}
            onAccessibilityAction={handleAccessibilityActions}
            accessibilityLabel={name}
            accessibilityHint={'swipe up or down for more actions'}
            accessibilityState={isIos ? {disabled}: {}}
            accessibilityValue={{text: text}}
            style={[styles.itemContainer, disabled && styles.headingDisable]} key={key}>
            <Image accessible={false} source={{uri: image}} resizeMode={'cover'} style={styles.image} />
            <View style={{width: '70%', paddingVertical: 10, marginStart: getMScale(16)}}>
                <RText
                    accessible={false}
                    accessibilityRole={'header'}
                    text={name}
                    numberOfLines={3}
                    color={colors.primary}
                    size={'xs'}
                    weight={'semiBold'}
                    ellipsizeMode={'tail'}
                    textStyle={styles.title}
                />
                <RText
                    accessible={false}
                    text={text}
                    textStyle={styles.redeemPoints}
                    size={'xxs'}
                    color={colors.subTitleText}
                    weight={'semiBold'}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        // flexWrap: 'wrap',
                        rowGap: getMScale(10),
                        columnGap: getMScale(1),
                        justifyContent: 'flex-start'
                    }}>
                    <TouchableOpacity
                        accessible={false}
                        aria-disabled={disabled}
                        disabled={disabled}
                        activeOpacity={0.7}
                        style={styles.itemBottomView}
                        onPress={onItemPress}>
                            <RText
                                allowFontScaling={false}
                                color={colors.secondary}
                                weight={'headerBold'}
                                text={'Scan In-Restaurant'}
                                size={'xxs'}
                            />
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessible={false}
                        aria-disabled={disabled}
                        hitSlop={{top: 15, bottom: 15, left: 10, right: 10}}
                        disabled={disabled}
                        style={styles.orderBtnView}
                        activeOpacity={0.7}
                        onPress={onOrderPress}>
                            <RText
                                allowFontScaling={false}
                                accessible={false}
                                color={colors.white}
                                weight={'headerBold'}
                                text={'Order'}
                                size={'xxs'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
  );
};
export default React.memo(RedemptionItem);
