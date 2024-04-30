import axiosOloInstance from '../../axiosInterceptor';

export const getProductOption = (id: number) => {
  try {
    return axiosOloInstance
      .get(`/products/${id}/modifiers?includedisabled=false`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
