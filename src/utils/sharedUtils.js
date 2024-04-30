import {Platform} from 'react-native';
import {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {checkPermissions} from './permissionsUtils';
import GetLocation from 'react-native-geolocation-service';

export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export function capitalizeString(str) {
  // convert the string to lowercase and split it into an array of words
  let words = str.toLowerCase().split(' ');

  // iterate over each word and capitalize the first letter
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // join the words back together into a string
  return words.join(' ');
}

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getCurrentLocation = () => {
  const permission = isIos
    ? PERMISSIONS.IOS.LOCATION_ALWAYS
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  return new Promise((resolve, reject) => {
    checkPermissions(permission)
      .then(result => {
        if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
          GetLocation.getCurrentPosition(
            location => {
              const {coords} = location || {};
              resolve(coords);
            },
            () => {},
            {enableHighAccuracy: true},
          );
        }
        // else {
        //   if (isIos) {
        //     checkPermissions(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        //       if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        //         GetLocation.getCurrentPosition(
        //           location => {
        //             const {coords} = location || {};
        //             resolve(coords);
        //           },
        //           () => {},
        //           {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        //         );
        //       } else {
        //         resolve('denied');
        //       }
        //     });
        //   }
        //   else {
        //     resolve('denied');
        //   }
        // }
        else {
          resolve(result);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const formatLocationName = item => {
  return item?.replace(/\s-\s#\d+/, '') || '';
};

export const formatImageUrl = url => typeof url === 'boolean' ? '' : url;