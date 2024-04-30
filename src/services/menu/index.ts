import axiosOloInstance from '../axiosInterceptor';
import {getProductImages} from '../../utils/productUtils';

export const getMenuItem = (id: number) => {
  try {
    return axiosOloInstance
      .get(`/restaurants/${id}/menu?includedisabled=false`)
      .then(response => {
        getProductImages(response?.data);
        const data = {
          ...response.data,
          categories: response.data.categories.map((category: any) => ({
            ...category,
            products: category.products.map((product: any) => ({
              ...product,
              isNewDesign:
                category.metadata?.[0]?.key === 'isNewMenu' &&
                category.metadata?.[0]?.value === 'true',
            })),
          })),
        };
        return data;
      })
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
