import {productSelectionsTypes} from '../../../types/product/selection';

const INITIAL_STATE = {};

const productSelectionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case productSelectionsTypes.SELECT_OPTION:
      const {option, optionIndex, modifier} = action?.payload || {};
      const {
        id: modifierId,
        mandatory,
        description,
        isQuantityStepper,
        minSelects,
        maxSelects,
        minAggregateQuantity,
      } = modifier || {};
      const {optionId, name} = option || {};
      const {[modifierId]: prevOptions = {}} = state || {};
      let {selected: prevSelected = []} = prevOptions || {};
      const optionToInsert = {optionId, name, optionIndex, quantity: 1};
      let prevIndex = prevSelected?.findIndex(item => item?.optionId === optionId);
      if (prevIndex !== -1) {
        if (prevSelected.length > minSelects) {
          // logToConsole({boolStatus: prevSelected.length > minSelects});
          const removedItemQuantity = prevSelected[prevIndex].quantity;
          prevSelected.splice(prevIndex, 1);
          if (prevSelected.length && isQuantityStepper) {
            // logToConsole({isQuantityStepper});
            prevSelected[0].quantity += removedItemQuantity;
          }
        }
      } else if (maxSelects === 1) {
        prevSelected = [optionToInsert];
      } else if (prevSelected.length < maxSelects) {
        if (isQuantityStepper) {
          if (!prevSelected.length) {
            optionToInsert.quantity = minAggregateQuantity;
          } else {
            for (let i = 0; i < prevSelected.length; i++) {
              if (prevSelected[i].quantity > 1) {
                prevSelected[i].quantity -= 1;
              }
            }
          }
        }
        prevSelected.push(optionToInsert);
      }
      return {
        ...state,
        [modifierId]: {description, mandatory, selected: [...prevSelected]},
      };
    case productSelectionsTypes.DEFAULT_SELECTIONS:
      return {...(action.payload || {})};
    case productSelectionsTypes.RESET_SELECTIONS:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default productSelectionsReducer;
