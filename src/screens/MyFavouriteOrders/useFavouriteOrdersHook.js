import {useDispatch} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import {deleteFavOrder, getUserFavouriteOrders} from '../../redux/actions/user';
import {Alert} from 'react-native';
import {logFirebaseCustomEvent} from "../../utils/logFirebaseCustomeEvents";
import {screens, strings} from "../../constants";

const useFavouriteOrdersHook = () => {
  const dispatch = useDispatch();
  const {userFavoriteOrders, userDataLoading} = useUserSelector();

  const [favOrders, setFavOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserFavouriteOrders());
    }, [dispatch]),
  );

  useEffect(() => {
    if (userFavoriteOrders?.faves) {
      setFavOrders(userFavoriteOrders.faves);
    }
  }, [userFavoriteOrders]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'my_favorite_orders_screen',
    });
  }, []);

  const markAsUnFavourite = id => {
    dispatch(deleteFavOrder(id, () => setLoading(false)));
  };
  const onUnFavClick = item => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'star_icon',
      click_destination: 'Confirmation Dialog',
    });
    const order = item;
    Alert.alert(
      'Remove Favorite',
      'Are you sure about removing this favorite order? Once removed, this order cannot be added back.',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            logFirebaseCustomEvent(strings.click, {
              click_label: 'yes',
              click_destination: screens.MY_FAVOURITE,
            });
            setLoading(true);
            markAsUnFavourite(order?.id);
          },
        },
      ],
    );
  };

  return {
    userFavoriteOrders,
    favOrders,
    markAsUnFavourite,
    onUnFavClick,
    loading,
    userDataLoading,
  };
};
export default useFavouriteOrdersHook;
