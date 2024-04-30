import Geocoder from 'react-native-geocoding';
import {getAddress} from '../helpers/common';
import {logToConsole} from '../configs';

export const getLatLngFromAddress = address => {
  return new Promise((resolve, reject) => {
    Geocoder.from(address)
      .then(json => {
        if (json?.results?.length > 0) {
          resolve(json?.results[0]?.geometry?.location);
        } else {
          resolve(null);
        }
      })
      .catch(error => {
        logToConsole({getLatLngFromAddress: error});
        // displayToast('ERROR', 'Please enter a valid address');
        reject(error);
      });
  });
};

export const getAddressFromLatLng = (lat = 0, lng = 0) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(lat, lng)
      .then(async json => {
        if (json.results.length > 0) {
          const address = await getAddress(json.results[0]);
          resolve(address);
        } else {
          resolve('');
        }
      })
      .catch(error => {
        logToConsole({getAddressFromLatLng: error?.message});
        // displayToast('ERROR', '');
        reject(error);
      });
  });
};
