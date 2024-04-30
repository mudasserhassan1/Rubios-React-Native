import React, {useMemo, useRef, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import useRestaurantInfoSelector from './reduxStateHooks/useRestaurantInfoSelector';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  defaultModifiersSetters,
  formatModifiers,
  getAddToBagAnalyticsObjectForSelections,
  getOptionsImages,
  priceCalculator,
} from '../utils/productUtils';
import {getProductOption} from '../services/product/option';
import {logToConsole} from '../configs';
import {logFirebaseCustomEvent} from '../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../constants';
import {setBasketRequest} from '../redux/actions/basket/create';
import {addProductRequest} from '../redux/actions/basket/product/add';
import {displayToast} from '../helpers/toast';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../components/RText';
import BottomSheetModalComponent from '../components/BottomSheetModal/BottomSheetModalComponent';
import OptionsMapper from '../screens/ProductScreen/OptionsMapper';
import RButton from '../components/RButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../theme/metrics';
import {colors} from '../theme';
import BottomSheetHeader from '../components/BottomSheetHeader/BottomSheetHeader';
import {defaultSelect} from '../redux/actions/product/selections';
import {store} from '../redux/store';
import AccessibilityWrapper from '../components/AccessibilityWrapper/AccessibilityWrapper';
import {isIos} from '../utils/sharedUtils';
import NewOptionsMapper from '../screens/ProductScreen/NewOptionsMapper';

const useQuickAddToBag = () => {
  const [fetchingModifiersAndAddToBag, setFetchingModifiersAndAddToBag] = useState(false);
  const [modifiers, setModifiers] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToBag, setAddingToBag] = useState(false);
  const [product, setProduct] = useState();

  const route = useRoute();
  const {category} = route?.params || {};
  const {name: categoryName = '', id: categoryId = ''} = category ?? {};

  const {top} = useSafeAreaInsets();

  const productRef = useRef();
  const proteinsBottomSheetRef = useRef();
  const requiredModifierRef = useRef(null);

  //refs for accessibility
  const priceViewRef = useRef(null);
  const quantityViewRef = useRef(null);
  const addToBagButtonRef = useRef(null);

  const authToken = useSelector(state => state?.auth?.authToken);
  const {basket} = useSelector(state => state.basket);
  const {restaurant, orderType: deliveryType} = useRestaurantInfoSelector();
  const {address = {}} = useSelector(state => state.deliveryAddress);
  const selections = useSelector(state => state.productSelections);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const showProteinsBottomSheet = () => {
    proteinsBottomSheetRef?.current?.openSheet();
  };

  const closeProteinsBottomSheet = () => {
    proteinsBottomSheetRef?.current?.closeSheet();
  };

  const {price: adOnsPrice, enabled} = useMemo(() => {
    global.enabled = true;
    return priceCalculator({
      modifiers: modifiers,
      selections,
      enabled,
    });
  }, [modifiers, selections]);

  const finalPrice = useMemo(() => {
    const {cost: baseCost = 0} = product ?? {};
    return quantity * (adOnsPrice + baseCost).toFixed(2);
  }, [adOnsPrice, quantity, product]);

  const errorCallback = () => {
    setFetchingModifiersAndAddToBag(false);
    setAddingToBag(false);
    global.selections = {};
  };

  const addItemToBag = basketId => {
    const updatedSelections = store.getState()?.productSelections || {};
    const {optionIDs} = priceCalculator({
      modifiers: global?.defaultModifiers,
      selections: updatedSelections,
    });
    const successCallback = () => {
      const options = getAddToBagAnalyticsObjectForSelections(updatedSelections);
      logFirebaseCustomEvent(strings.add_to_cart_log_event, {
        currency: 'USD',
        value: parseFloat(finalPrice).toFixed(2),
        is_custom: false,
        item_list_id: categoryId, //category id
        item_list_name: categoryName, // category name
        items: [
          {
            item_id: productRef?.current?.id,
            item_name: productRef?.current?.name,
            price: parseFloat(productRef.current?.cost)?.toFixed(2) + adOnsPrice,
            quantity: quantity,
            ...options,
          },
        ],
      });
      displayToast('SUCCESS', 'Item has been added to bag.');
      setFetchingModifiersAndAddToBag(false);
      setAddingToBag(false);
      closeProteinsBottomSheet();
      global.selections = {};
      navigation.navigate(screens.CART);
    };

    const request = {
      quantity,
      productid: productRef.current.id,
      options: optionIDs.toString(),
    };
    dispatch(addProductRequest(basketId, request, successCallback, errorCallback));
  };

  const onAddToBag = ({response: responseBasket, product = {}} = {}) => {
    setAddingToBag(true);
    const {id: basketId} = basket || responseBasket || {};
    logToConsole({basketId});

    if (!basketId) {
      let payload = {
        callback: onAddToBag,
        errorCallback: errorCallback,
        deliverymode: {
          deliverymode: deliveryType || '',
        },
      };
      const request = {vendorid: restaurant?.id};
      if (authToken) {
        request.authtoken = authToken.authtoken;
      }
      payload.request = request;
      if (deliveryType === 'dispatch') {
        const {
          address2 = '',
          address1 = '',
          city = '',
          zip = '',
          isdefault = false,
        } = address ?? {};
        payload.deliveryAddress = {
          building: address2,
          streetaddress: address1,
          city: city,
          zipcode: zip,
          isdefault: isdefault,
        };
        if (address?.id) {
          payload.deliveryAddress.id = address.id;
        }
      }
      logFirebaseCustomEvent(strings.click, {
        click_label: 'add_to_bag',
        click_destination: screens.CART,
      });
      dispatch(setBasketRequest(payload));
    } else {
      logToConsole({insideElse: true});
      addItemToBag(basketId, product);
    }
  };

  const setDefaultModifiersAndAddToBag = (options, product) => {
    global.modifiers = [];
    if (options?.optiongroups) {
      //TODO: newDesign flag is function ma bhejna hai
      const formattedModifiers = formatModifiers(options, product?.isNewDesign)?.optiongroups;
      logToConsole({formattedModifiers})
      setModifiers(formattedModifiers);
      global.defaultModifiers = formattedModifiers;
      global.selections = {};
      defaultModifiersSetters({
        modifiers: formattedModifiers,
        isFirstLevel: true,
      });
      dispatch(defaultSelect(global.selections));
      const requiredModifiers = formattedModifiers?.filter(modifier => {
        return (
          modifier?.mandatory &&
          modifier?.options.filter(option => {
            return option.isdefault;
          }).length === 0
        );
      });

      logToConsole({requiredModifiers})

      requiredModifierRef.current = requiredModifiers?.[0];

      //scenario to add menu item directly to bag or open customization sheet
      switch (requiredModifiers?.length) {
        case 0:
          onAddToBag({product});
          break;
        case 1:
          getOptionsImages(options.optiongroups);
          setFetchingModifiersAndAddToBag(false);
          showProteinsBottomSheet?.();
          break;
        default:
          setFetchingModifiersAndAddToBag(false);
          displayToast(
            'ERROR',
            'We cannot add this item to the bag at the moment. Please choose customize option instead.',
          );
          break;
      }
    } else {
      setFetchingModifiersAndAddToBag(false);
      global.selections = {};
    }
  };

  const onQuickAddPress = async product => {
    productRef.current = product;
    setProduct(product);
    setFetchingModifiersAndAddToBag(true);
    try {
      const response = await getProductOption(product?.id);
      setDefaultModifiersAndAddToBag(response, product);
    } catch (e) {
      setFetchingModifiersAndAddToBag(false);
      global.selections = {};
      logToConsole({error: e.message});
    }
  };
  const renderChooseProteinsBottomSheet = () => {
    return (
      <BottomSheetModalComponent
        hideHandleBar
        ref={proteinsBottomSheetRef}
        topInset={top}
        onSheetDismiss={() => setQuantity(1)}
        snapPoints={['100%']}
        snapIndex={0}>
        <View style={styles.bottomSheetContentContainer}>
          <BottomSheetHeader
            title={requiredModifierRef?.current?.description || 'Choose'}
            titleStyle={{width: '70%', textAlign: 'center'}}
            onClose={closeProteinsBottomSheet}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.proteinsScrollContentContainer}>
            {product?.isNewDesign ? (
              <NewOptionsMapper modifiers={modifiers} isProtein />
            ) : (
              <OptionsMapper modifiers={modifiers} isProtein />
            )}
          </ScrollView>
          {renderBottomView()}
        </View>
      </BottomSheetModalComponent>
    );
  };

  const renderBottomView = () => {
    return (
      <AccessibilityWrapper fieldsRefs={[priceViewRef, quantityViewRef, addToBagButtonRef]}>
        <View style={styles.bottomView}>
          <View style={styles.priceContainer}>
            <RText
              ref={priceViewRef}
              numberOfLines={1}
              text={`$ ${(finalPrice || 0)?.toFixed(2)}`}
              weight={'headerBold'}
              size={'lg'}
              minimumFontScale={0.4}
              adjustsFontSizeToFit={true}
            />
          </View>
          <View style={styles.quantityParent}>
            <View ref={quantityViewRef} style={styles.bottomQuantityView}>
              <TouchableOpacity
                accessibilityLabel={'minus'}
                accessibilityState={isIos ? {disabled: quantity === 1} : {}}
                accessibilityHint="activate to decrease the quantity"
                disabled={quantity === 1}
                onPress={() => setQuantity(prevState => prevState - 1)}
                style={[styles.stepperInnerView, {borderRightWidth: 1}]}>
                <RText text={'-'} weight={'medium'} size={'xs'} />
              </TouchableOpacity>
              <RText
                weight={'semiBold'}
                accessibilityHint={'quantity'}
                size={'xs'}
                text={`${quantity}`}
              />
              <TouchableOpacity
                accessibilityLabel={'plus'}
                accessibe
                accessibilityHint={'activate to increase the quantity'}
                onPress={() => setQuantity(prevState => prevState + 1)}
                style={[styles.stepperInnerView, {borderLeftWidth: 1}]}>
                <RText text={'+'} weight={'medium'} size={'xs'} />
              </TouchableOpacity>
            </View>
          </View>
          <View ref={addToBagButtonRef}>
            <RButton
              accessibilityHint={
                enabled
                  ? 'activate to add this item to bag'
                  : 'make a selection to activate this button'
              }
              title={strings.add_to_bag}
              disabled={!enabled || addingToBag}
              onPress={onAddToBag}
              buttonStyle={styles.addCartView}
              titleStyle={styles.addCartTitle}
              loading={addingToBag}
            />
          </View>
        </View>
      </AccessibilityWrapper>
    );
  };

  return {
    onQuickAddPress,
    fetchingModifiersAndAddToBag,
    modifiers,
    creatingBasket: fetchingModifiersAndAddToBag,
    renderChooseProteinsBottomSheet,
  };
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: getVerticalScale(77),
    alignItems: 'center',
    backgroundColor: colors.bottomSheetHeaderColor,
    justifyContent: 'center',
  },
  crossIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    position: 'absolute',
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  proteinItem: {width: (SCREEN_WIDTH - 50) / 3, alignItems: 'center'},
  proteinItemText: {
    textAlign: 'center',
    height: getVerticalScale(30),
    width: getMScale(110),
    marginTop: getVerticalScale(10),
  },
  proteinItemCost: {marginTop: getVerticalScale(10)},
  bottomSheetHeaderText: {textTransform: 'uppercase', width: '50%', textAlign: 'center'},
  bottomSheetContentContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  proteinsScrollContentContainer: {
    paddingTop: getVerticalScale(20),
    paddingBottom: getVerticalScale(50),
  },
  bottomView: {
    paddingVertical: getVerticalScale(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.7,
        shadowRadius: 12.0,
        shadowColor: colors.black,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  priceContainer: {width: '28%', paddingStart: getMScale(10)},
  quantityParent: {width: '27%'},
  bottomQuantityView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 50,
    paddingVertical: 5,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5.0,
        shadowColor: colors.black,
      },
    }),
  },
  quantityTitle: {
    // marginRight: 20,
  },
  stepperView: {
    borderRadius: 10,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stepperInnerView: {
    width: 30,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.offWhite,
  },
  addCartView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: getMScale(42),
    backgroundColor: colors.palette.secondary,
    paddingHorizontal: 12,
    width: getMScale(155),
    // width: 'auto',
    marginEnd: getMScale(10),
  },
  addCartTitle: {
    color: colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
  },
});
export default useQuickAddToBag;
