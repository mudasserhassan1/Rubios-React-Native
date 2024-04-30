import React, {forwardRef, useRef} from 'react';
import {Image, View} from 'react-native';
import styles from './styles';
import ImageComponent from '../ImageComponent/ImageComponent';
import RText from '../RText';
import CaloriesAndPriceView from '../CaloriesAndPriceView/CaloriesAndPriceView';
import {colors} from '../../theme';
import AccessibilityProductHeader from "../../screens/ProductScreen/AccessibilityProductHeader";
import AccessibilityWrapper from "../AccessibilityWrapper/AccessibilityWrapper";
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";
import {getVerticalScale} from "../../theme/metrics";

const ProductInfo = forwardRef(({item, onPress, instructions}, ref) => {
    const {name = '', description = ''} = item || {};
    const headerRef = useRef(null);
    const titleRef = useRef(null);
    const caloriesViewRef = useRef(null);
    const descriptionRef = useRef(null);
    const {isAccessibilityOn} = useUserSelector();

    return (
        <AccessibilityWrapper fieldsRefs={[headerRef, titleRef, caloriesViewRef, descriptionRef]}>
            <View style={styles.infoContainer} onPress={onPress}>
                {isAccessibilityOn ? <AccessibilityProductHeader ref={headerRef}/> : null}
                <Image
                    accessible={false}
                    source={{uri: global?.modifierImage}}
                    resizeMode={'cover'}
                    style={styles.infoImage}
                    accessibilityHint={'Product Image'}
                />
                <View style={{paddingHorizontal: 10, marginVertical: 15}}>
                    <RText
                        ref={titleRef}
                        text={name}
                        accessibilityRole={'header'}
                        weight={'headerBold'}
                        textStyle={{textTransform: 'uppercase', lineHeight: 24}}
                    />
                    <CaloriesAndPriceView ref={caloriesViewRef} item={item} priceTextColor={colors.primary} />
                    <RText ref={descriptionRef} text={description} textStyle={{marginTop: 7, lineHeight: 17}} size={'xs'} />
                    {
                        instructions ? (
                            <RText size={'xs'} weight={'bold'} text={`NOTE: ${instructions}`} textStyle={{marginTop: getVerticalScale(10)}}/>
                        ) : null
                    }
                </View>
            </View>
        </AccessibilityWrapper>
    );
});
export default ProductInfo;
