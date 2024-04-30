import {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

function NetInfoHandler() {
  useEffect(() => {
    return NetInfo.addEventListener(networkState => {
      global.isNetConnected = networkState?.isConnected;
      // global.isNetConnected =
      //   networkState?.isInternetReachable ?? networkState?.isConnected;
    });
  }, []);

  return null;
}

export default NetInfoHandler;
