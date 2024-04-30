import {
  RequestApplyCoupon,
  RequestUpdateBasketTip,
  RequestUpdateBasketTimeWanted,
  RequestBasketSubmit,
} from '../../types/olo-api';
import axiosOloInstance from '../axiosInterceptor';

export const applyCouponBasket = (basketid: string, body: RequestApplyCoupon): any => {
  try {
    return axiosOloInstance
      .put(`/baskets/${basketid}/coupon`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const removeCouponBasket = (basketid: string): any => {
  try {
    return axiosOloInstance
      .delete( `/baskets/${basketid}/coupon`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const setTipAmountBasket = (basketid: string, body: RequestUpdateBasketTip): any => {
  try {
    return axiosOloInstance
      .put( `/baskets/${basketid}/tip`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const setTimeWantedBasket = (basketid: string, body: RequestUpdateBasketTimeWanted): any => {
  try {
    return axiosOloInstance
      .put(`/baskets/${basketid}/timewanted`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const deleteTimeWantedBasket = (basketid: string): any => {
  try {
    return axiosOloInstance
      .delete( `/baskets/${basketid}/timewanted`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const validateBasket = (basketid: string): any => {
  try {
    return axiosOloInstance
      .post( `/baskets/${basketid}/validate`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const submitSinglePaymentBasket = (basketid: string, body: RequestBasketSubmit): any => {
  try {
    return axiosOloInstance
      .post( `/baskets/${basketid}/submit`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const submitMultiplePaymentBasket = (basketid: string, body: any): any => {
  try {
    return axiosOloInstance
      .post( `/baskets/${basketid}/submit/multiplepayments`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getBasketAllowedCards = (basketid: string): any => {
  try {
    return axiosOloInstance
      .get(`/baskets/${basketid}/billingschemes`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getGiftCardBalance = (basketId: string, billingSchemeId: string, body: any): any => {
  try {
    return axiosOloInstance
      .post( `/baskets/${basketId}/billingschemes/${billingSchemeId}/retrievebalance`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const verifyGiftCardPinRequirement = (billingSchemeId: string, body: any): any => {
  try {
    return axiosOloInstance
      .post(`/billingschemes/${billingSchemeId}/binvalidation`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
