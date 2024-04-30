import axiosOloInstance from '../../../axiosInterceptor';

export const removeRewardsFromBasket = (basketID: string, rewardid: string): any => {
  try {
    return axiosOloInstance
      .delete(`/baskets/${basketID}/loyaltyrewards/${rewardid}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
