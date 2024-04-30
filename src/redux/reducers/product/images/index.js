import {modifierImagesTypes} from '../../../types/product/images';

const INITIAL_STATE = {};

const modifiersImagesReducer = (state = INITIAL_STATE, action) => {
  const {type, payload} = action || {};
  switch (type) {
    case modifierImagesTypes.SET_MODIFIER_IMAGES:
      return {
        ...state,
        ...(payload.data || {}),
      };
    default:
      return state;
  }
};

export default modifiersImagesReducer;
