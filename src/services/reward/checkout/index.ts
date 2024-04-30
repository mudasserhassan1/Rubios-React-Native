import axiosOloInstance from '../../axiosInterceptor';

export const getRewardsByTokenAndVendorID = (vendorID: string, authToken: string): any => {
  try {
    return axiosOloInstance
      .get( `/users/${authToken}/qualifyingrewards?vendorId=${vendorID}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
