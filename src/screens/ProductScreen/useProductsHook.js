import {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeImageSize} from '../../helpers/common';
import {defaultSelect, resetSelections} from '../../redux/actions/product/selections';
import {
  getProductOptionRequest,
  resetExpandedModifiers,
  resetProductOptions,
} from '../../redux/actions/product/option';
import {
  defaultModifiersSetters,
  formatModifiers,
  getAddToBagAnalyticsObjectForSelections,
  getOptionsImages,
  priceCalculator,
} from '../../utils/productUtils';
import {setBasketRequest} from '../../redux/actions/basket/create';
import {addProductRequest} from '../../redux/actions/basket/product/add';
import {useNavigation, useRoute} from '@react-navigation/native';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {updateProductRequest} from '../../redux/actions/basket/product/update';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {screens, strings} from '../../constants';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {logToConsole} from '../../configs';

// const newDesignMenu = "2725348412,2725348415,2722636854,2722636855,2722636856,2725142093,2722645943,2725738617,2725726912,2725688362,2725688376,2725729955,2725730022"
const useProductsHook = () => {
  const route = useRoute();
  const {
    productId,
    isEditingProduct,
    productPrice,
    productName,
    shortDescription,
    categoryId,
    categoryName,
    metaData,
    product: {
      choices,
      id: productEditId = '', //cart item id
      productId: editProductId, //actual product id
      quantity: editProductQuantity = 1,
      name: editProductName = '',
      basecost: editBaseCost = 0,
    } = {},
  } = route?.params || {};

  const [modifiers, setModifiers] = useState([]);
  const [product, setProduct] = useState({});
  const [isModifiersLoading, setIsModifiersLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(editProductQuantity || 1);
  const [isOpenedBottomSheet, setIsOpenedBottomSheet] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {basketLoading} = useBasketSelector();
  const {restaurant, orderType: deliveryType} = useRestaurantInfoSelector();
  let {options} = useSelector(state => state.productOptions);
  const selections = useSelector(state => state.productSelections);
  const authToken = useSelector(state => state?.auth?.authToken);
  const {basket} = useSelector(state => state.basket);
  const {address = {}} = useSelector(state => state.deliveryAddress);
  const {categories} = useSelector(state => state?.category);

  const {name: restaurantName, id: restaurantId} = restaurant || {};

  const {imagefilename, cost: baseCost} = product || {};

  const proteinsBottomSheetRef = useRef(null);

  global.modifierImage = useMemo(() => {
    return (
      categories?.imagepath +
        changeImageSize(imagefilename, product?.images, 'mobile-webapp-menu') || ''
    );
  }, [categories?.imagepath, imagefilename, product]);

  global.productName = useMemo(() => product?.name, [product]);

  const {address2, address1, city, zip, isdefault} = address || {};

  const choiceIds = useMemo(
    () => choices?.reduce((set, choice) => set.add(String(choice?.optionid)), new Set()),
    [choices],
  );

  useEffect(() => {
    global.animateFirstSelection = true;
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'product_screen',
    }).then();
    logFirebaseCustomEvent(strings.view_item, {
      currency: 'USD',
      value: productPrice,
      items: [{price: productPrice, item_id: productId, item_name: productName}],
    }).then();
    return () => {
      dispatch(resetExpandedModifiers());
    };
  }, []);

  useEffect(() => {
    for (let category of categories?.categories || []) {
      const {products} = category || {};
      for (let p of products || []) {
        if (productId === p?.id) {
          p.isNewDesign =
            category.metadata?.[0]?.key === 'isNewMenu' && category.metadata?.[0]?.value === 'true';

          setProduct(p);
          break;
        }
      }
    }
  }, [categories, productId]);

  useEffect(() => {
    dispatch(getProductOptionRequest(productId, () => setIsModifiersLoading(false)));
    return () => {
      dispatch(resetProductOptions());
      dispatch(resetSelections());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (options?.optiongroups && !isModifiersLoading) {
      const formattedModifiers = formatModifiers(
        options,
        choiceIds,
        product?.isNewDesign,
      )?.optiongroups;
      logToConsole({formattedModifiers});
      global.selections = {};
      defaultModifiersSetters({
        modifiers: formattedModifiers,
        isEditingProduct,
        choiceIds,
        isFirstLevel: true,
      });
      setModifiers(formattedModifiers);
      getOptionsImages(options.optiongroups);
      dispatch(defaultSelect(global.selections));
    }
  }, [choiceIds, dispatch, isEditingProduct, isModifiersLoading, options]);

  const {
    price: adOnsPrice,
    enabled,
    optionIDs,
  } = useMemo(() => {
    global.enabled = true;
    return priceCalculator({
      modifiers: modifiers,
      selections,
      enabled,
    });
  }, [modifiers, selections]);

  const finalPrice = useMemo(
    () => quantity * (adOnsPrice + baseCost).toFixed(2),
    [adOnsPrice, baseCost, quantity],
  );

  const isAddToBagDisabled = isLoading || isModifiersLoading || !enabled;

  const addToBagCallback = () => {
    const options = getAddToBagAnalyticsObjectForSelections(selections);
    logFirebaseCustomEvent(strings.add_to_cart_log_event, {
      currency: 'USD',
      value: finalPrice,
      is_custom: global.isCustomized,
      item_list_id: categoryId, //category id
      item_list_name: categoryName, // category name
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: productPrice + adOnsPrice,
          quantity: quantity,
          ...options,
        },
      ],
    }).then();
    setIsLoading(false);
    navigation.replace(screens.CART);
  };

  const updateBagCallback = () => {
    const options = getAddToBagAnalyticsObjectForSelections(selections);
    setIsLoading(false);
    const updatedQty = Math.abs(parseInt(editProductQuantity, 10) - parseInt(quantity, 10));
    const itemDetail = {
      currency: 'USD',
      is_custom: global?.isCustomized,
      value: (editBaseCost + adOnsPrice) * updatedQty,
      items: [
        {
          item_id: editProductId,
          item_name: editProductName,
          price: editBaseCost + adOnsPrice,
          quantity: updatedQty,
          ...options,
        },
      ],
    };
    logFirebaseCustomEvent(strings.add_to_cart_log_event, itemDetail);
    navigation.navigate(screens.CART);
  };

  const onAddToBag = ({response: responseBasket} = {}) => {
    setIsLoading(true);
    const {id: basketId} = basket || responseBasket || {};
    if (!basketId) {
      let payload = {
        callback: onAddToBag,
        errorCallback: () => setIsLoading(false),
        deliverymode: {
          deliverymode: deliveryType || '',
        },
      };
      const request = {vendorid: restaurantId};
      if (authToken) {
        request.authtoken = authToken.authtoken;
      }
      payload.request = request;
      if (deliveryType === 'dispatch') {
        payload.deliveryAddress = {
          building: address2 || '',
          streetaddress: address1 || '',
          city: city || '',
          zipcode: zip || '',
          isdefault: isdefault || false,
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
      const errorCallback = () => {
        setIsLoading(false);
      };
      const request = {
        quantity,
        productid: productId,
        options: optionIDs.toString(),
      };
      if (isEditingProduct) {
        // logToConsole({basketId, productEditId, request});
        dispatch(
          updateProductRequest(
            basketId,
            parseInt(productEditId, 10),
            request,
            updateBagCallback,
            errorCallback,
          ),
        );
      } else {
        dispatch(addProductRequest(basketId, request, addToBagCallback, errorCallback));
      }
    }
  };

  const onBottomSheetDismiss = () => {
    setIsOpenedBottomSheet(false);
  };

  return {
    modifiers,
    isModifiersLoading,
    quantity,
    restaurantName,
    isAddToBagDisabled,
    deliveryType,
    product,
    categories,
    restaurantId,
    onAddToBag,
    setQuantity,
    finalPrice,
    isEditingProduct,
    proteinsBottomSheetRef,
    isOpenedBottomSheet,
    onBottomSheetDismiss,
    basketLoading,
    isLoading,
    shortDescription,
    metaData,
  };
};

export default useProductsHook;
