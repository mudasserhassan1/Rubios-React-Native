import React, {useCallback, useRef, useState} from 'react';
import {Animated, Button, ScrollView, TouchableOpacity, View} from 'react-native';

import styles from './styles';
import RText from '../../components/RText';
import useProductsHook from './useProductsHook';
import {strings} from '../../constants';
import {getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import ProductInfo from '../../components/MenuItem/ProductInfo';
import DynamicHeader from './AnimatedHeader';
import OptionsMapper from './OptionsMapper';
import RButton from '../../components/RButton';
import Placeholder from './Placeholder';
import AccessibilityWrapper from '../../components/AccessibilityWrapper/AccessibilityWrapper';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import NewOptionsMapper from './NewOptionsMapper';
import {DrinksBottomSheet} from './DrinksBottomSheet';
import {logToConsole} from '../../configs';
import {useDispatch} from 'react-redux';
import {selectOption} from '../../redux/actions/product/selections';
import BottomSheetHeader from "../../components/BottomSheetHeader/BottomSheetHeader";
import BottomSheetModalComponent from "../../components/BottomSheetModal/BottomSheetModalComponent";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const ProductScreen = () => {
  const drinkBottomSheetRef = useRef(null);
  const [drinkDialogProps, setDrinkDialogProps] = useState();

  const {
    modifiers,
    isModifiersLoading,
    isLoading,
    quantity,
    isAddToBagDisabled,
    product,
    categories,
    finalPrice,
    onAddToBag,
    setQuantity,
    isEditingProduct = false,
    shortDescription,
  } = useProductsHook();
  const {isAccessibilityOn} = useUserSelector();
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  //refs for accessibility
  const priceViewRef = useRef(null);
  const quantityViewRef = useRef(null);
  const addToBagButtonRef = useRef(null);

  const showDrinksModal = drinkModalProps => {
    // onSelectOption(dOption, dOption.optionIndex, dOption.modifier);
    setDrinkDialogProps(drinkModalProps);
    drinkBottomSheetRef?.current?.openSheet?.();
  };

  const dispatch = useDispatch();

  const onSelectOption = useCallback(
    ({option: {id: optionId, name: optionName} = {}, modifier, optionIndex} = {}) => {
      const {options: _, ...rest} = modifier;
      if (typeof customOptionSelectionHandler === 'function') {
        customOptionSelectionHandler?.({
          modifier: rest,
          optionIndex,
          option: {optionId, name: optionName},
        });
      } else {
        logToConsole({modifier: rest, optionIndex, option: {optionId, name: optionName}})
        dispatch(selectOption({modifier: rest, optionIndex, option: {optionId, name: optionName}}));
      }
    },
    [dispatch],
  );

  const renderBottomView = () => {
    if (!isModifiersLoading) {
      return (
        <AccessibilityWrapper fieldsRefs={[priceViewRef, quantityViewRef, addToBagButtonRef]}>
          <View accessible={false} style={styles.bottomView}>
            <View
              ref={priceViewRef}
              accessible
              importantForAccessibility="yes"
              style={styles.priceContainer}>
              <RText
                numberOfLines={1}
                text={`$ ${finalPrice?.toFixed(2)}`}
                weight={'headerBold'}
                accessibilityHint={'total price'}
                size={'lg'}
                minimumFontScale={0.4}
                adjustsFontSizeToFit={true}
              />
            </View>
            <View style={styles.quantityParent}>
              <View ref={quantityViewRef} style={styles.bottomQuantityView}>
                <TouchableOpacity
                  accessible
                  accessibilityHint={quantity === 1 ? 'activate to reduce quantity' : ''}
                  disabled={quantity === 1}
                  accessibilityLabel={'minus'}
                  onPress={() => setQuantity(prevState => prevState - 1)}
                  style={[styles.stepperInnerView, {borderRightWidth: 1}]}>
                  <RText text={'-'} weight={'medium'} size={'xs'} />
                </TouchableOpacity>
                <RText
                  accessible
                  accessibilityHint={'quantity'}
                  weight={'semiBold'}
                  size={'xs'}
                  text={`${quantity}`}
                />
                <TouchableOpacity
                  accessible
                  accessibilityLabel={'plus'}
                  accessibilityHint={'activate to increase quantity'}
                  onPress={() => setQuantity(prevState => prevState + 1)}
                  style={[styles.stepperInnerView, {borderLeftWidth: 1}]}>
                  <RText text={'+'} weight={'medium'} size={'xs'} />
                </TouchableOpacity>
              </View>
            </View>
            <View ref={addToBagButtonRef}>
              <RButton
                accessible
                accessibilityRole={'button'}
                accessibilityHint={'activate to add item to cart'}
                title={isEditingProduct ? strings.update_bag : strings.add_to_bag}
                disabled={isAddToBagDisabled}
                onPress={onAddToBag}
                // allowFontScaling={false}
                buttonStyle={styles.addCartView}
                titleStyle={styles.addCartTitle}
                loading={isLoading}
              />
            </View>
          </View>
        </AccessibilityWrapper>
      );
    }
  };


  const showDrinkBottomSheet = () => {
    drinkBottomSheetRef?.current?.openSheet();
  };

  const closeDrinkBottomSheet = () => {
    drinkBottomSheetRef?.current?.closeSheet();
    drinkBottomSheetRef.current =  null;
  };

  const {top} = useSafeAreaInsets();

  logToConsole({modifiers})
  const renderBottomSheet=()=>{
    return(
    <BottomSheetModalComponent
        hideHandleBar
        ref={drinkBottomSheetRef}
        topInset={top}
        onSheetDismiss={() => closeDrinkBottomSheet()}
        snapPoints={['100%']}
        snapIndex={0}
    >
      <View style={styles.bottomSheetContentContainer}>
        <BottomSheetHeader
            title={'Choose'}
            titleStyle={{width: '70%', textAlign: 'center'}}
            onClose={closeDrinkBottomSheet}
        />
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.proteinsScrollContentContainer}>
          <OptionsMapper modifiers={modifiers} isProtein />
        </ScrollView>
        {/*{renderDoneView()}*/}
      </View>
    </BottomSheetModalComponent>
    )
  }

  return (
      <>
    <View style={styles.container}>
      {!isAccessibilityOn ? (
        <DynamicHeader animHeaderValue={scrollOffsetY} title={product?.name || ''} />
      ) : null}
      <ScrollView
        scrollEnabled={!isModifiersLoading}
        style={{flex: 1}}
        contentContainerStyle={{
          width: SCREEN_WIDTH,
          paddingBottom: getVerticalScale(20),
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollOffsetY}}}], {
          useNativeDriver: false,
        })}
        bounces={false}>
        <ProductInfo
          item={product}
          categories={categories}
          isMainItem={false}
          instructions={shortDescription}
        />
        <Placeholder loading={isModifiersLoading} />
        {!isModifiersLoading &&
          (product.isNewDesign ? (
            <NewOptionsMapper
              key={'options'}
              modifiers={modifiers}
              isEditingProduct={isEditingProduct}
              metaData={product?.isNewDesign}
              showDrinksModal={showDrinksModal}
            />
          ) : (
            <OptionsMapper
              key={'options'}
              modifiers={modifiers}
              isEditingProduct={isEditingProduct}
              metaData={product?.isNewDesign}
              showDrinksModal={showDrinksModal}
            />
          ))}
      </ScrollView>
      {!isModifiersLoading ? renderBottomView() : null}

    </View>
        <DrinksBottomSheet
            drinkBottomSheetRef={drinkBottomSheetRef}
            option={drinkDialogProps?.option}
            parentModifier={drinkDialogProps?.parentModifier}
            onDone={onSelectOption}
        />
      </>
  );
};

export default ProductScreen;
