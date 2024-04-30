import axiosOloInstance from '../axiosInterceptor';
import axiosPunchhInstance from "../axiosInterceptor/axiosPunchhInstance";

export const requestLocations = () => {
  try {
    const url = `/api2/dashboard/locations`;
    return axiosPunchhInstance
      .get(url, {
        headers: {},
      })
      .then(response => response.data);
  } catch (error) {
    throw error;
  }
};

export const requestSingleLocation = (store_number: any) => {
  try {
    const url = `/api2/dashboard/locations?store_number=${store_number}`;
    return axiosPunchhInstance
      .get(url)
      .then(response => response.data)
      .catch(e => {
        throw e;
      });
  } catch (error) {
    throw error;
  }
};

export const getNearByRestaurants = (
  lat: number,
  long: number,
  radius: number,
  limit: number,
  startDate: string,
  endDate: string,
) => {
  try {
    return axiosOloInstance
      .get(`/restaurants/near?lat=${lat}&long=${long}&radius=${radius}&limit=${limit}&calendarstart=${startDate}&calendarend=${endDate}`,)
      .then(response => response.data)
      .catch(error => {
        console.log(error.response);
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getAllResturants = () => {
  try {
    return axiosOloInstance
      .get( '/restaurants?includePrivate=true')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
