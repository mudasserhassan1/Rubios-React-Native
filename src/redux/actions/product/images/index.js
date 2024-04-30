import {modifierImagesTypes} from '../../../types/product/images';

export function setModifierImages(payload) {
  return {
    type: modifierImagesTypes.SET_MODIFIER_IMAGES,
    payload,
  };
}
