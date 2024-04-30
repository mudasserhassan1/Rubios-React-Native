import {ImageBackground, StyleSheet, View} from 'react-native';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import {images} from '../../assets';
import RText from '../../components/RText';
import {colors} from '../../theme';
import useUpsellsSelector from '../../hooks/reduxStateHooks/useUpsellsSelector';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {useCallback, useEffect, useMemo, useState} from 'react';
import UpsellsItem from '../../components/UpsellsItemCard/UpsellsItem';
import {getUnixTimeStamp, unixTime} from '../../utils/timeUtils';
import {getUpsellsProducts, getUpsellsStatsFromOrder} from './utils';
import {isEmpty} from '../../helpers/common';
import {addUpsellsRequest} from '../../redux/actions/basket/upsell/Add';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'lodash';
import {addMultipleProductsRequest} from '../../redux/actions/basket/addMultipleProducts';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";

const CompleteYourOrder = ({onAddUpsellItem}) => {
  const [sidesProducts, setSidesProducts] = useState([]);
  const [dessertsProducts, setDessertsProducts] = useState([]);
  const [drinksProducts, setDrinksProducts] = useState([]);
  const [selectedItemsForQty, setSelectedItemsForQty] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [upsellsCombination, setUpsellsCombination] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0);

  const {sides_to_show = '', desserts_to_show = '', drinks_to_show = ''} = useSelector(state => state.firebaseConfig?.config.upsells_config ?? {});

  const {sidesToShow = [], dessertsToShow = [], drinksToShow = []} = useMemo(() => {
    return {
      sidesToShow: sides_to_show?.split(','),
      dessertsToShow: desserts_to_show?.split(','),
      drinksToShow: drinks_to_show?.split(','),
    }
  }, [sides_to_show, desserts_to_show, drinks_to_show])

  const dispatch = useDispatch();
  const {upsells} = useUpsellsSelector();
  const {basket} = useBasketSelector();
  const {products: basketProducts = [], deliverymode = ''} = basket || {};
  const modifierImages = useSelector(state => state.modifiersImages);
  const {isAccessibilityOn} = useUserSelector();

  // const {} =
  useEffect(() => {
    onAddUpsellItem(loading);
  }, [loading]);
  const {
    availableSides = [],
    availableDrinks = [],
    availableDesserts = [],
  } = useMemo(() => {
    const {upsellsSides, upsellsDrinks, upsellsDesserts} = getUpsellsProducts(upsells);
    const sidesShouldInclude = [];
    upsellsSides?.forEach(item => {
      if (sidesToShow.includes(item.name.toLowerCase())) {
        sidesShouldInclude.push(item);
      }
    });
    const drinksShouldInclude = [];
    upsellsDrinks?.forEach(item => {
      if (drinksToShow.includes(item.name.toLowerCase())) {
        drinksShouldInclude.push(item);
      }
    });
    const dessertsShouldInclude = [];
    upsellsDesserts?.map(item => {
      if (dessertsToShow.includes(item.name.toLowerCase())) {
        dessertsShouldInclude.push(item);
      }
    });

    return {
      availableSides: sidesShouldInclude || [],
      availableDrinks: drinksShouldInclude || [],
      availableDesserts: dessertsShouldInclude || [],
    };
  }, [deliverymode, upsells]);

  useEffect(() => {
    const mappedSidesProducts = mapProducts(availableSides, 'sides');
    const mappedDessertsProducts = mapProducts(availableDesserts, 'desserts');
    const mappedDrinksProducts = mapProducts(availableDrinks, 'drinks');
    setSidesProducts(mappedSidesProducts);
    setDessertsProducts(mappedDessertsProducts);
    setDrinksProducts(mappedDrinksProducts);
  }, [availableDesserts, availableDrinks, availableSides]);

  const globalOptions = {};
  const mapProducts = (arr = [], type = '') => {
    if (arr.length > 0) {
      if (type === 'drinks') {
        const bottledDrinkItem = arr.filter(item => item.name === 'Bottled Drinks')[0];
        arr.push(bottledDrinkItem);
        arr.push(bottledDrinkItem);
      }
      let prod = arr?.map((obj, index) => {
        const updatedProd = {
          ...obj,
          newId: unixTime() + index + 2100 + obj.id,
          quantity: 0,
          selected: false,
        };
        const {options = [], mandatory = false} = updatedProd || {};
        if (options?.length > 0) {
          if (!mandatory && options?.findIndex(opt => opt.id === 55555555555) === -1) {
            const newOption = {
              adjustsparentcalories: false,
              adjustsparentprice: false,
              availability: {
                always: true,
                description: null,
                enddate: null,
                isdisabled: false,
                now: true,
                startdate: null,
              },
              basecalories: null,
              caloriesseparator: null,
              chainoptionid: getUnixTimeStamp(1500),
              children: false,
              cost: 0,
              costoverridelabel: null,
              displayid: null,
              fields: null,
              id: 55555555555,
              isdefault: false,
              maxcalories: null,
              menuitemlabels: [],
              metadata: null,
              modifiers: null,
              name: 'As is',
            };
            options.unshift(newOption);
          }
          globalOptions[`${updatedProd.newId}`] = {
            optionId: `${updatedProd.options[0].id}`,
            cost: updatedProd.options[0].cost,
            name: updatedProd.options[0].name,
          };
        }
        return updatedProd;
      });
      if (type === 'drinks') {
        prod.forEach((item, index) => {
          const {options = []} = item || {};
          let requiredOptionName;
          if (index === 1) {
            requiredOptionName = 'Jarritos Mineragua';
          } else if (index === 2) {
            requiredOptionName = 'Jarritos Mandarin';
          } else if (index === 3) {
            requiredOptionName = 'Jarritos Pineapple';
          }
          if (requiredOptionName) {
            let requiredOptionIndex = -1;
            options.forEach((item, index) => {
              if (item.name === requiredOptionName) {
                requiredOptionIndex = index;
              }
            });
            if (requiredOptionIndex > -1) {
              globalOptions[`${item.newId}`] = {
                optionId: `${item.options[requiredOptionIndex].id}`,
                cost: item.options[requiredOptionIndex].cost,
                name: item.options[requiredOptionIndex].name,
                image: modifierImages[item.options[requiredOptionIndex]?.chainoptionid],
              };
            }
          }
        });
      }
      setSelectedOptions(globalOptions);
      return prod;
    }
  };

  const getRemainingUpsellsItems = useCallback(() => {
    const allProducts = [dessertsProducts[0], ...sidesProducts, ...drinksProducts];
    const basketBottledDrinks = basketProducts.filter(item => item.name === 'Bottled Drinks');
    const choicesMadeAlready = basketBottledDrinks.map(item => item?.choices?.[0]?.name);
    const remainingProducts = [];
    allProducts?.forEach(item => {
      const isDrinkItem = item?.name === 'Bottled Drinks';
      const {name = ''} = selectedOptions?.[item?.newId] || '';
      const basketItem = basketProducts.filter(p => p.productId === item?.id)[0];
      const doesSameChoiceExists = choicesMadeAlready.includes(name);
      if (!basketItem || (isDrinkItem && !doesSameChoiceExists)) {
        remainingProducts.push(item);
      }
    });
    return remainingProducts;
  }, [basketProducts, dessertsProducts, drinksProducts, selectedOptions, sidesProducts]);

  useEffect(() => {
    let items = [];
    if (sidesProducts?.length > 0 && drinksProducts?.length > 0 && dessertsProducts?.length > 0) {
      const {sides, desserts, drinks} = getUpsellsStatsFromOrder(basketProducts, upsells);
      let drinksFirstIndex = deliverymode === 'dispatch' ? 1 : 0;
      if (!desserts && !drinks && !sides) {
        items = [dessertsProducts?.[0], sidesProducts?.[0], drinksProducts[drinksFirstIndex]];
      } else if (drinks && !desserts && !sides) {
        items = [dessertsProducts?.[0], sidesProducts?.[0], sidesProducts?.[2]];
      } else if (drinks && sides && !desserts) {
        items = [...dessertsProducts];
      } else if (drinks && desserts && !sides) {
        items = [...sidesProducts];
      } else if (sides && !drinks && !desserts) {
        items = [
          dessertsProducts?.[0],
          ...drinksProducts.slice(drinksFirstIndex, 2 + drinksFirstIndex),
        ];
      } else if (sides && desserts && !drinks) {
        items = drinksProducts.slice(drinksFirstIndex, 3 + drinksFirstIndex);
      } else if (desserts && !drinks && !sides) {
        items = [sidesProducts?.[0], sidesProducts?.[2], drinksProducts?.[drinksFirstIndex]];
      } else {
        //If all category upsells are in basket
        const remainingItems = getRemainingUpsellsItems();
        items = remainingItems.slice(0, 3);
        // return;
      }
      if (items?.length < 3) {
        const remainingItems = getRemainingUpsellsItems();
        if (remainingItems.length <= 3) {
          items = remainingItems;
        } else {
          items.forEach(upsellItem => {
            if (items?.length < 3) {
              const newItem = remainingItems?.filter(rem => rem.newId !== upsellItem.newId)[0];
              if (newItem) {
                items.push(newItem);
              }
            }
          });
        }
      }
    }
    setUpsellsCombination(items);
  }, [
    basketProducts,
    deliverymode,
    dessertsProducts,
    drinksProducts,
    getRemainingUpsellsItems,
    sidesProducts,
    upsells,
  ]);

  const onPressGreenPlusIcon = item => {
    setSelectedItemsForQty(prevState => {
      const newState = [...prevState, item.newId];
      handleQtyChange(item, 'plus', newState);
      return newState;
    });
  };

  const addToBag = (item, totalCost) => {
    setLoading(true);
    const isDrinkItem = String(item?.name)?.toLowerCase().includes('drink');
    if (item.quantity > 0) {
      let choices = [];
      let options = '';
      if (
        selectedOptions[item?.newId]?.optionId &&
        selectedOptions[item?.newId]?.optionId !== '55555555555'
      ) {
        choices = [
          {
            choiceid: selectedOptions[item?.newId]?.optionId,
          },
        ];
        options = `${selectedOptions[item?.newId]?.optionId}`;
      }
      const obj = {
        productid: item?.id,
        quantity: item?.quantity,
      };
      if (isDrinkItem) {
        obj.options = options;
        dispatch(addUpsellsRequest(basket?.id, obj, () => handleLogEvents(item, totalCost)));
      } else {
        obj.choices = choices;
        const payload = {
          products: [obj],
        };
        dispatch(
          addMultipleProductsRequest(basket?.id, payload, () => handleLogEvents(item, totalCost)),
        );
      }
    }
  };

  const handleLogEvents = (item, totalCost) => {
    setLoading(false);
    const itemDetail = {
      currency: 'USD',
      value: totalCost,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item?.cost,
          quantity: item?.quantity,
        },
      ],
    };
    logFirebaseCustomEvent(strings.add_to_cart_log_event, {
      ...itemDetail,
    });
  };

  const calculateTotalCost = (products, newSelectedState) => {
    const selectedItems = products.filter(item => newSelectedState.includes(item.newId));
    return selectedItems.reduce((total, item) => {
      if (selectedOptions?.[item.newId] && selectedOptions?.[item?.newId]?.cost) {
        return total + selectedOptions?.[item?.newId]?.cost * item.quantity;
      } else {
        return total + item.cost * item.quantity;
      }
    }, 0);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceAddToBag = useCallback(debounce(addToBag, 2000), [selectedOptions]);

  const handleQtyChange = (item, type, newSelectedState = selectedItemsForQty) => {
    const {id, newId} = item || {};
    let itemsInBasket = 0;
    if (basket && basket?.products?.length) {
      const filterProduct = basket?.products?.filter(obj => obj?.productId === id);
      if (filterProduct && filterProduct?.length > 0) {
        filterProduct?.forEach(prod => {
          itemsInBasket += prod?.quantity;
        });
      }
    }
    const isDrinkItem = item?.name.toLowerCase().includes('drink');

    const maximumBasketQuantity = isEmpty(item.maximumbasketquantity)
      ? -1
      : parseInt(item.maximumbasketquantity, 10);
    const maximumQuantity = isEmpty(item.maximumquantity) ? -1 : parseInt(item.maximumquantity, 10);
    let limit = isDrinkItem ? 6 : maximumBasketQuantity - itemsInBasket;

    let count;
    if (type === 'plus') {
      count = item.quantity + 1;
    } else {
      if (item.quantity === 0) {
        count = 0;
      } else {
        if (item.quantity === 1) {
          setSelectedItemsForQty(prevState =>
            prevState.filter(selectedId => selectedId !== item.newId),
          );
        }
        count = item.quantity - 1;
      }
    }
    count =
      maximumQuantity === -1 || maximumBasketQuantity === -1
        ? count
        : count >= maximumQuantity
        ? maximumQuantity
        : count >= maximumBasketQuantity
        ? maximumBasketQuantity
        : count <= 0
        ? 0
        : count;

    // showErrorMsg(obj, basketCount, count, type, maximumBasketQuantity, maximumQuantity);

    if (count <= limit || limit < 0) {
      item = {
        ...item,
        quantity: count,
      };
      const updatedProducts = upsellsCombination.map(obj => {
        if (obj.newId === newId) {
          return {...item};
        } else {
          return {
            ...obj,
          };
        }
      });

      const totalCost = calculateTotalCost(updatedProducts, newSelectedState);
      setTotalPrice(totalCost);
      setUpsellsCombination(updatedProducts);
      logFirebaseCustomEvent(strings.click, {
        click_label: 'plusIcon',
        click_destination: 'Increase/Decrease Upsell Items',
      });
      if (!isAccessibilityOn) {
        debounceAddToBag(item, totalCost);
      }
    }
  };

  if (upsellsCombination?.length === 0) {
    return null;
  }
  return (
    <ImageBackground source={images.complete_your_order_bg} style={styles.imageBackground}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <RText
          accessible
          accessibilityRole={'header'}
          text={'Complete your order'}
          weight={'headerBold'}
          textStyle={styles.heading}
          color={colors.secondary}
        />
        {totalPrice > 0 ? (
          <RText
            text={`$ ${parseFloat(totalPrice).toFixed(2)}`}
            weight={'semiBold'}
            textStyle={styles.heading}
            size={'xs'}
            color={colors.secondary}
          />
        ) : null}
      </View>
      <View
        style={[
          styles.itemContainer,
          upsellsCombination.length === 3 && {justifyContent: 'space-between'},
        ]}>
        {upsellsCombination.map(upsell => {
          return (
            <UpsellsItem
              item={upsell}
              onPressPlusIcon={onPressGreenPlusIcon}
              selected={selectedItemsForQty.includes(upsell?.newId)}
              onQtyChange={handleQtyChange}
              disabledAddIcon={selectedItemsForQty.length > 0}
              loading={loading}
              selectedOptions={selectedOptions?.[upsell?.newId]}
              totalCost={totalPrice}
              onAccessibilityAddToBag={addToBag}
            />
          );
        })}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: SCREEN_WIDTH,
    minHeight: getMScale(204),
    paddingHorizontal: getMScale(15),
    paddingTop: getMScale(20),
  },
  heading: {textTransform: 'uppercase'},
  itemContainer: {
    flexDirection: 'row',
    marginTop: getVerticalScale(16),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
export default CompleteYourOrder;
