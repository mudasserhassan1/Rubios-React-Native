import {useMemo, useState, useEffect} from 'react';
import useUpsellsSelector from '../../hooks/reduxStateHooks/useUpsellsSelector';
import {getUnixTimeStamp} from '../../utils/timeUtils';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {isEmpty} from '../../helpers/common';
import {useDispatch} from 'react-redux';
import {addMultipleProductsRequest} from '../../redux/actions/basket/addMultipleProducts';
import {constants} from '../../constants';
import {addUpsellsRequest} from '../../redux/actions/basket/upsell/Add';

const useUpsellsModal = ({selectedCategory, onClose}) => {
  const [selectedItemForQty, setSelectedItemForQty] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [quantity, setQuantity] = useState(0); //For DRINKS Categories only

  const {upsells = []} = useUpsellsSelector();
  const {basket = {}, basketLoading} = useBasketSelector();
  const dispatch = useDispatch();

  const upsellsProducts = useMemo(() => {
    return upsells?.filter(item => item.type === selectedCategory)?.[0]?.products || [];
  }, [selectedCategory, upsells]);

  useEffect(() => {
    if (upsells && upsells.length) {
      let prod = [];
      if (upsellsProducts?.length > 0) {
        const option = {};
        prod = upsellsProducts?.map(obj => {
          const updatedProd = {
            ...obj,
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

            option[`${updatedProd.id}`] = {
              optionId: `${updatedProd.options[0].id}`,
              cost: updatedProd.options[0].cost,
              name: updatedProd.options[0].name,
            };
          }
          return updatedProd;
        });
        setSelectedOptions(option);
      }
      setProducts(prod);
    }
  }, [upsells, selectedCategory, upsellsProducts]);

  const showErrorMsg = (obj, basketCount, count, type, maximumBasketQuantity, maximumQuantity) => {
    if (maximumBasketQuantity !== -1 && maximumBasketQuantity === basketCount && type === 'plus') {
      setErrorMessage(
        `You may only order upto ${maximumBasketQuantity} ${obj.name ? obj.name : ''}`,
      );
    } else if (maximumQuantity !== -1 && obj.quantity + 1 > maximumQuantity && type === 'plus') {
      setErrorMessage(
        `You may only add upto ${maximumQuantity} ${obj.name ? obj.name : ''} at a time.`,
      );
    } else if (count !== obj.quantity) {
      setErrorMessage('');
    }
  };

  const onOptionSelect = (opt, productItem) => {
    const filterOpt = productItem?.options?.filter(op => op.id === parseInt(opt.id));
    setSelectedOptions(prevState => ({
      ...prevState,
      [productItem.id]: {
        optionId: opt.id,
        name: opt.name,
        cost: (filterOpt?.length && filterOpt[0]?.cost) || 0,
      },
    }));
  };

  const handleQtyChange = (item, type) => {
    const {id} = item || {};
    let basketCount = 0;
    if (basket && basket.products.length) {
      const filterProduct = basket.products.filter(obj => obj.productId === id);
      if (filterProduct && filterProduct.length > 0) {
        filterProduct.forEach(prod => {
          basketCount += prod.quantity;
        });
      }
    }
    const updatedProducts = products.map(obj => {
      if (obj.id === id) {
        const maximumBasketQuantity = isEmpty(obj.maximumbasketquantity)
          ? -1
          : parseInt(obj.maximumbasketquantity, 10);
        const maximumQuantity = isEmpty(obj.maximumquantity)
          ? -1
          : parseInt(obj.maximumquantity, 10);
        let limit = maximumBasketQuantity - basketCount;

        let count;
        if (type === 'plus') {
          count = obj.quantity + 1;
        } else {
          if (obj.quantity === 0) {
            count = 0;
          } else {
            if (obj.quantity === 1) {
              setSelectedItemForQty(prevState => prevState.filter(item => item !== id));
            }
            count = obj.quantity - 1;
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

        showErrorMsg(obj, basketCount, count, type, maximumBasketQuantity, maximumQuantity);

        if (count <= limit || limit < 0) {
          return {
            ...obj,
            quantity: count,
          };
        } else {
          return {
            ...obj,
          };
        }
      } else {
        return {
          ...obj,
        };
      }
    });
    setProducts(updatedProducts);
  };

  const handleDrinksItemSelection = (item, selected) => {
    const updatedProducts = products.map(obj => {
      let newObj = {
        ...obj,
      };
      if (item.id === obj.id) {
        newObj.selected = !selected;
      } else {
        newObj.selected = false;
      }
      if (newObj.selected && selectedCategory === constants.UPSELLS_TYPES.DRINK) {
        setSelectedOptions({
          optionId: obj?.options[0]?.id,
          cost: obj?.options[0]?.cost,
          name: obj?.options[0]?.name,
        });
      }
      return newObj;
    });
    setProducts(updatedProducts);
  };

  const isDisabledButton = useMemo(() => {
    let totalQty = 0;
    if (products && products.length) {
      totalQty = products.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue.quantity;
      }, 0);
    }
    return (
      selectedCategory !== constants.UPSELLS_TYPES.DRINK &&
      (totalQty === 0 || basketLoading || isButtonDisabled)
    );
  }, [basketLoading, isButtonDisabled, products, selectedCategory]);

  const isDisabledForDrinksItems = useMemo(() => {
    return (
      selectedCategory === constants.UPSELLS_TYPES.DRINK &&
      (quantity === 0 ||
        (products && !products.filter(obj => obj.selected).length) ||
        isButtonDisabled)
    );
  }, [isButtonDisabled, products, quantity, selectedCategory]);

  const onDrinksItemQtyChange = type => {
    let count = type === 'plus' ? quantity + 1 : quantity - 1;
    count = count >= 6 ? 6 : count <= 0 ? 0 : count;
    setQuantity(count);
  };

  const onAddDrinksUpsellsToBag = () => {
    if (products && products.length) {
      const selectedProducts = products.filter(obj => obj.selected);
      if (selectedProducts && selectedProducts.length) {
        const request = {
          productid: selectedProducts[0].id,
          quantity: quantity,
          options: '',
        };
        request.options = `${selectedOptions?.optionId}`;
        setIsButtonDisabled(true);
        // dispatch(addProductRequest(basketObj.basket.id, request));
        dispatch(addUpsellsRequest(basket?.id, request));
      }
    }
  };

  const onAddToBag = () => {
    onClose?.();
    if (products && products.length) {
      const finalProducts = [];
      products.forEach(product => {
        if (product.quantity > 0) {
          let choices = [];
          if (
            selectedOptions[product.id]?.optionId &&
            selectedOptions[product.id].optionId !== '55555555555'
          ) {
            choices = [
              {
                choiceid: selectedOptions[product.id].optionId,
              },
            ];
          }
          const obj = {
            productid: product.id,
            quantity: product.quantity,
            choices: choices,
          };
          finalProducts.push(obj);
        }
      });
      if (finalProducts.length) {
        const payload = {
          products: finalProducts,
        };
        setIsButtonDisabled(true);
        dispatch(addMultipleProductsRequest(basket?.id, payload));
      }
    }
    onClose?.();
  };

  const onSubmit = () => {
    if (selectedCategory === constants.UPSELLS_TYPES.DRINK) {
      onAddDrinksUpsellsToBag();
    } else {
      onAddToBag();
    }
    onClose?.();
  };

  const onPressGreenPlusIcon = item => {
    handleQtyChange(item, 'plus');
    setSelectedItemForQty(prevState => [...prevState, item.id]);
  };
  return {
    upsellsProducts,
    products,
    selectedOptions,
    quantity,
    errorMessage,
    onOptionSelect,
    handleQtyChange,
    handleDrinksItemSelection,
    isDisabledButton,
    isDisabledForDrinksItems,
    onDrinksItemQtyChange,
    onSubmit,
    onPressGreenPlusIcon,
    selectedItemForQty,
  };
};
export default useUpsellsModal;
