import {offersType as Type} from '../../types/offers';

const initialState = {
  offers: null,
};

const offersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Type.GET_OFFERS_SUCCESS:
      return {...state, offers: action.payload || {}};
    default:
      return state;
  }
};

export default offersReducer;
