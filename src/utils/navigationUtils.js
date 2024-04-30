import React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigateTo(name, params = {}) {
  navigationRef.current.navigate(name, params);
}

// export function replaceWith(name, params = {}){
//   navigationRef.current.replace(name, params);
// }

export function replaceWith(name, params = {}) {
  navigationRef.current.dispatch(StackActions.replace(name, params));
}

export function dispatch(params) {
  navigationRef.current?.dispatch(params);
}

export function goBack(params) {
  navigationRef.current?.goBack?.(params);
}

export const popScreens = (numOfScreens = 1) => {
  navigationRef.current?.pop?.(numOfScreens);
};

export const resetAndNavigate = (screenName, index = 0, params = {}) => {
  NavigationService.dispatch(
    CommonActions.reset({
      index: index,
      routes: [{name: screenName, params}],
    }),
  );
};

export const moveToPreviousScreenWithMerge = (screenName, params = {}, replace = false) => {
  if (replace) {
    navigationRef.current.replace({name: screenName, params, merge: true});
  } else {
    navigationRef.current.navigate({name: screenName, params, merge: true});
  }
};
export const NavigationService = {
  navigateTo,
  goBack,
  dispatch,
  resetAndNavigate,
  navigateOnAuthBasic: resetAndNavigate,
};
