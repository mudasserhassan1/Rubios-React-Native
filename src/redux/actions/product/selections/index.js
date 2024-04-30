import {productSelectionsTypes} from '../../../types/product/selection';

export function selectOption(payload) {
  return {
    type: productSelectionsTypes.SELECT_OPTION,
    payload,
  };
}

export function resetSelections() {
  return {
    type: productSelectionsTypes.RESET_SELECTIONS,
  };
}

export function defaultSelect(modifiers) {
  return {
    type: productSelectionsTypes.DEFAULT_SELECTIONS,
    payload: modifiers,
  };
}
