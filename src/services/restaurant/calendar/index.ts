import axiosOloInstance from '../../axiosInterceptor';

export const getRestaurantCalendar = (id: number, dateFrom: string, dateTo: string) => {
  try {
    return axiosOloInstance
      .get( `/restaurants/${id}/calendars?from=${dateFrom}&to=${dateTo}`)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
