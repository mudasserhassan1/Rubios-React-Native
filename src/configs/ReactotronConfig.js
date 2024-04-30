import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules} from 'react-native';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

const scriptURL = NativeModules.SourceCode.scriptURL;
const host = scriptURL.split('://')[1].split(':')[0];
const reactotron = Reactotron.configure({
  name: 'Rubios',
  host,
})
  .use(sagaPlugin())
  .use(reactotronRedux())
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative()
  .connect();

export const sagaMonitor = Reactotron.createSagaMonitor();
export const reactotronEnhancer = reactotron.createEnhancer();

reactotron?.clear?.();

export const logToConsole = params => {
  if (__DEV__) {
    reactotron.warn(params);
    console.log(params);
  }
};

export const displayToConsole = (value, name, config = {}) => {
  if (__DEV__) {
    reactotron.display({
      name: 'DEBUGGER',
      value,
      preview: name,
      ...config,
    });
    console.log(value);
  }
};

export const logNavigationToConsole = (value, name = 'NAVIGATION', config) => {
  if (__DEV__) {
    reactotron.display({
      name: name,
      value,
      preview: name,
      ...config,
    });
    console.log(value);
  }
};
export default reactotron;
