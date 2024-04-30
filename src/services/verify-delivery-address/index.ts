import axiosOloInstance from '../axiosInterceptor';

export const requestToVerifyDeliveryAddress = (resturantID: number, body: any): any => {
  try {
    return axiosOloInstance
      .post( `/restaurants/${resturantID}/checkdeliverycoverage`, body)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
