import {ActivityIndicator, Platform, Pressable, TouchableOpacity, View} from 'react-native';
import RText from '../RText';
import React, {useMemo} from 'react';
import {changeImageSize} from '../../helpers/common';
import useCategoriesSelector from '../../hooks/reduxStateHooks/useCategoriesSelector';
import {colors} from '../../theme';
import styles from './styles';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import DeleteIcon from '../../assets/svgs/DeleteIcon';
import AddIconGreen from '../../assets/svgs/AddIconGreen';
import ImageComponent from '../ImageComponent/ImageComponent';
import {getMScale} from '../../theme/metrics';

const UpsellsItem = (
    {
        item,
        selected,
        onQtyChange,
        onPressPlusIcon,
        isSalsaItem,
        selectedOptions,
        loading,
        containerStyle,
        disabledAddIcon,
        onAccessibilityAddToBag,
        totalCost,
    }) => {
    const {quantity, name, maximumquantity, cost} = item || {};
    const {name: optionName, cost: optionCost, image: modifierImage = ''} = selectedOptions || {};

    const {imagepath} = useCategoriesSelector();
    const itemName = name === 'Bottled Drinks' && optionName ? optionName : name;
    const itemCost = optionCost || cost;

    const getUpsellItemImageFullPath = (path, images) => {
        if (modifierImage) {
            return modifierImage;
        }
        const optimizedSize = changeImageSize(path || '', images || '', 'mobile-webapp-menu');
        return `${imagepath}${optimizedSize}`;
    };

    const renderQuantitySelectorOrAddIcon = () => {
        if (selected) {
            return (
                <Animated.View entering={BounceIn} exiting={BounceOut} style={styles.quantitySelector}>
                    <Pressable
                        accessible={false}
                        hitSlop={15}
                        style={styles.leftQtyView}
                        disabled={loading}
                        onPress={() => onQtyChange(item, 'minus')}>
                        {quantity <= 1 ? (
                            <DeleteIcon />
                        ) : (
                            <RText text={'-'} size={'lg'} weight={'semiBold'} color={colors.subTitleText} />
                        )}
                    </Pressable>
                    <View accessibilityLabel={String(quantity)} accessibilityHint={'selected quantity'} style={{width: 30}}>
                        {loading ? (
                            <ActivityIndicator size={'small'} color={colors.secondary} />
                        ) : (
                            <RText
                                text={String(quantity)}
                                size={'xs'}
                                textStyle={styles.quantityText}
                                weight={'semiBold'}
                            />
                        )}
                    </View>
                    <Pressable
                        hitSlop={15}
                        size={'xs'}
                        weight={'semiBold'}
                        disabled={loading || quantity === parseInt(maximumquantity, 10)}
                        style={styles.rightQtyView}
                        onPress={() => onQtyChange(item, 'plus')}>
                        <RText
                            text={'+'}
                            size={'lg'}
                            weight={'semiBold'}
                            color={
                                quantity === parseInt(maximumquantity, 10)
                                    ? colors.handleColor
                                    : colors.subTitleText
                            }
                        />
                    </Pressable>
                </Animated.View>
            );
        }
        return (
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    disabled={!!disabledAddIcon}
                    onPress={() => onPressPlusIcon(item)}>
                    <AddIconGreen />
                </TouchableOpacity>
            </View>
        );
    };

    const accessibilityActions = useMemo(() => {
        const actions = [
            {name: 'decrement', label: 'decrease quantity, activate to decrease quantity'},
            {name: 'increment', label: 'increase quantity, activate to increase quantity'},
        ];
        if (!isSalsaItem) {
            actions.push({name: 'add', label: 'add, activate to add item to bag'});
        }
        return Platform.select({ios: selected ? actions : [{name: 'activate', label: 'activate to choose quantity'}], android: []});
    }, [selected, isSalsaItem])

    const handleAccessibilityAction = (event) => {
        switch (event.nativeEvent.actionName){
            case 'activate':
                onPressPlusIcon(item);
                break;
            case 'decrement':
                onQtyChange(item, 'minus');
                break;
            case 'increment':
                onQtyChange(item, 'plus')
                break;
            case 'add':
                onAccessibilityAddToBag(item, totalCost);
                break;
            default:
                break;
        }
    }

    return (
        <View
            accessible={true}
            accessibilityLabel={itemName}
            accessibilityValue={{text: itemCost > 0 ? `$ ${itemCost}`: ''}}
            accessibilityHint={`activate to choose quantity, swipe up or down for more actions`}
            accessibilityActions={accessibilityActions}
            onAccessibilityAction={handleAccessibilityAction}
            // onAccessibilityTap={() => onPressPlusIcon(item)}
            style={[
                {
                    maxWidth: getMScale(113),
                    minWidth: getMScale(105),
                    minHeight: getMScale(120),
                    marginHorizontal: getMScale(3),
                },
                containerStyle,
            ]}>
            <View style={styles.circularItem}>
                <View accessible={false} style={styles.circularView}>
                    <ImageComponent
                        source={{uri: getUpsellItemImageFullPath(item?.imagefilename, item?.images)}}
                        style={styles.image}
                        resizeMode={'contain'}
                    />
                </View>
                {renderQuantitySelectorOrAddIcon()}
                <RText
                    accessible={false}
                    text={itemName}
                    color={colors.primary}
                    weight={'semiBold'}
                    size={'xxs'}
                    textStyle={styles.itemName}
                    // numberOfLines={2}
                />
                {!isSalsaItem ? (
                    <RText
                        accessible={false}
                        text={itemCost > 0 ? `$ ${itemCost}` : ''}
                        size={'xxs'}
                        textStyle={{lineHeight: 16, marginTop: getMScale(5)}}
                    />
                ) : null}
            </View>
        </View>
    );
};
export default UpsellsItem;
