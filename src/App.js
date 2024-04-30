import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {initialWindowMetrics, SafeAreaProvider} from 'react-native-safe-area-context';
import {ErrorBoundary} from './screens/ErrorScreen/ErrorBoundary';
import RootNavigator from './navigations/RootNavigator';
import Config from 'react-native-config';
import Gleap from 'react-native-gleapsdk';
import RootContainer from './containers/RootContainer';
import {enableLatestRenderer} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {isAndroid} from './utils/sharedUtils';
import {LogBox, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logToConsole} from './configs';

enableLatestRenderer();
LogBox.ignoreAllLogs();
const App = () => {
  useEffect(() => {
    if (isAndroid) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setBarStyle('dark-content');
    }
    DeviceInfo.getUniqueId()
      .then(uniqueId => {
        AsyncStorage.setItem('uniqueId', uniqueId);
      })
      .catch(e => {
        logToConsole({e: e.message});
      });
  }, []);

  useEffect(() => {
    logToConsole({ENVIRONMENT: Config.ENVIRONMENT});
    Geocoder.init(Config.REACT_APP_GOOGLE_API_KEY, {language: 'en'});
    if (!__DEV__) {
      // Gleap.initialize(constants.GLEAP_KEY);
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ErrorBoundary>
            <RootNavigator />
            <RootContainer />
          </ErrorBoundary>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
