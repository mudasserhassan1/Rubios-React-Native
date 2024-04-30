import custom from '../axiosInterceptor';
import Config from "react-native-config";

export const getFooterMenu = () => {
  try {
    const url = Config.REACT_APP_FOOTER_URL || '';
    return custom(url).then((response) => response.data);
  } catch (error) {
    throw error;
  }
};
