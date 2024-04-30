import axiosOloInstance from '../axiosInterceptor';

export const getRestaurantInfo = (id: number) => {
  try {
    return axiosOloInstance
      .get( `/restaurants/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getOrderStatus = (orderId: number) => {
  try {
    return axiosOloInstance
      .get(`/orders/${orderId}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
