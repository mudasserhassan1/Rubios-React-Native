import axios from 'axios';
import {store} from '../../redux/store';
import {
  RequestCreateBasket,
  RequestNewBasketProduct,
  RequestBasketProductBatch,
  RequestBasketAddUpsell,
  RequestSetDeliveryMode,
  RequestDeliveryAddress,
} from '../../types/olo-api';
import axiosOloInstance from '../axiosInterceptor';
import {logToConsole} from "../../configs";

export const getBasket = (basketid: string) => {
  try {
    return axiosOloInstance
      .get(`/baskets/${basketid}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getDummyBasket = (body: RequestCreateBasket) => {
  try {
    return axiosOloInstance
      .post('/baskets/create', body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const setBasketDeliveryMode = (basketid: string, body: RequestSetDeliveryMode) => {
  try {
    return axiosOloInstance
      .put(`/baskets/${basketid}/deliverymode`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const setBasketDeliveryAddress = async (basketid: string, body: RequestDeliveryAddress) => {
  try {
    return await axiosOloInstance
      .put(`/baskets/${basketid}/dispatchaddress`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const setBasketCustomFields = (basketid: string, customFields: any) => {
  try {
    const requests: any = [];
    customFields?.forEach((element: any) => {
      requests.push(axios.put(`/baskets/${basketid}/customfields`, element));
    });
    return axios.all(requests).catch(error => {
      console.log(error.response);
      throw error;
    });
  } catch (error) {
    throw error;
  }
};

export const addSingleProduct = (basketid: string, body: RequestNewBasketProduct) => {
  try {
    return axiosOloInstance
      .post( `/baskets/${basketid}/products`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const addMultipleProducts = (basketid: string, body: RequestBasketProductBatch) => {
  try {
    return axiosOloInstance
      .post(`/baskets/${basketid}/products/batch`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const updateMultipleProducts = (basketid: string, body: RequestBasketProductBatch) => {
  try {
    return axiosOloInstance
      .put(`/baskets/${basketid}/products/batch`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const removeProduct = (basketid: string, basketProductId: number) => {
  try {
    return axiosOloInstance
      .delete(`/baskets/${basketid}/products/${basketProductId}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = (
  basketid: string,
  basketProductId: number,
  body: RequestNewBasketProduct,
) => {
  try {
    const productId=basketProductId
    return axiosOloInstance
      .put(`/baskets/${basketid}/products/${productId}`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const requestCreateBasket = (body: RequestCreateBasketFromOrder) => {
  try {
    return axiosOloInstance
      .post( '/baskets/createfromorder', body)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const requestCreateBasketForFav = (body: RequestCreateBasketFromFave) => {
  try {
    const auth_token = store.getState().auth.authToken.authtoken;
    return axiosOloInstance
      .post('/baskets/createfromfave?authtoken=' + auth_token, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getUpSells = (vendorid: string) => {
  try {
    return axiosOloInstance
      .get(`/upsells/${vendorid}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const addUpSells = (basketid: string, body: RequestBasketAddUpsell) => {
  try {
    return axiosOloInstance
      .post(`/baskets/${basketid}/upsell`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const createGuestUser = () => {
  try {
    const payload = {
      password: 'asdf1234',
      optin: true,
    };
    return axiosOloInstance
      .post( '/orders/a98726df-1cd1-ec11-a9c9-aad2a287f600/createuser', payload)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const generateCCSFToken = (basketid: string, body: any) => {
  try {
    return axiosOloInstance
      .post(`/baskets/${basketid}/checkout`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const basketTransfer = (basketId: string, vendorId: any) => {
  try {
    const body = {
      vendorid: vendorId,
    };
    return axiosOloInstance
      .post(`/baskets/${basketId}/transfer`, body)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
