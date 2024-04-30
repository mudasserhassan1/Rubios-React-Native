import {TouchableOpacity, View, StyleSheet, Platform, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RText from '../../components/RText';
import MenuIcon from '../../assets/svgs/MenuIcon';
import CircularIcon from '../../components/CircularIcon/CircularIcon';
import Cart from '../../assets/svgs/CartIcon';
import EmailIcon from '../../assets/svgs/EmailIcon';
import {colors} from '../../theme';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {screens, strings} from '../../constants';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Placeholder from './Placeholder';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {homeSideMenuBarSheetStatus} from '../../redux/actions/modalSheetStatus';
import useModalSheetStatusSelector from '../../hooks/reduxStateHooks/useModalSheetStatusSelector';
import {isAndroid} from "../../utils/sharedUtils";

const DrawerHeader = ({bottomSheetRef, loading}) => {
  const {top} = useSafeAreaInsets();
  const {basket = {}} = useBasketSelector();
  const {products = []} = basket || {};
  const {userProfile = {}} = useUserSelector();
  const {first_name = ''} = userProfile || {};
  const {isGuest} = useGuestSelector();
  const [sum, setSum] = useState(4);
  const {isAccessibilityEnabledOnHomeScreen = false} = useModalSheetStatusSelector() || {};
  const dispatch = useDispatch();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const {messages = [], loading: messagesLoading = false} = useSelector(
    state => state.messagesReducer,
  );

  const unreadNotifications = useMemo(() => {
    return messages?.reduce((sum, item) => {
      if (!item?.read_at && item?.message_type !== 'business_wide') {
        return sum + 1;
      }
      return sum;
    }, 0);
  }, [messages]);

  useFocusEffect(
    useCallback(() => {
      if (!messagesLoading) {
        setUnreadMessages(unreadNotifications);
      }
    }, [messagesLoading, unreadNotifications]),
  );

  const displayName = useMemo(() => (isGuest ? 'there' : first_name), [isGuest, first_name]);
  const navigation = useNavigation();
  const calculateCartQuantity = () => {
    let sum = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      sum += product.quantity;
    }
    setSum(sum);
  };

  useEffect(() => {
    calculateCartQuantity();
  }, [products]);

  const openHomeSideMenuSheet = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'hamburgerIcon',
      click_destination: 'Open Home Side Menu Sheet',
    });
    dispatch(homeSideMenuBarSheetStatus(true));
    bottomSheetRef?.current?.openSheet?.();
  };

  const openCart = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'cartIcon',
      click_destination: screens.CART,
    });
    navigation.navigate(screens.CART);
  };

  const openMessages = () => {
    setUnreadMessages(0);
    logFirebaseCustomEvent(strings.click, {
      click_label: 'messageIcon',
      click_destination: screens.NOTIFICATIONS,
    });
    navigation.navigate(screens.NOTIFICATIONS);
  };

  return (
    <View style={[styles.parent, {height: top + 90}]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          accessible={isAccessibilityEnabledOnHomeScreen}
          accessibilityLabel={'Menu'}
          accessibilityRole={'button'}
          accessibilityHint={'activate to open Side Menu.'}
          style={styles.menuIcon}
          hitSlop={{
            bottom: 30,
            left: 20,
            right: 20,
            top: 30,
          }}
          onPress={openHomeSideMenuSheet}>
          <MenuIcon />
        </TouchableOpacity>
        {loading ? (
          <Placeholder />
        ) : (
          <RText
            text={`HI ${displayName}!`}
            accessible={isAccessibilityEnabledOnHomeScreen}
            accessibilityLabel={`Username Hi ${displayName}!`}
            accessibilityHint={'heading'}
            weight={'headerBold'}
            size={isAndroid ? 'lg' : 'xl'}
            numberOfLines={1}
            ellipsizeMode={'tail'}
            textStyle={styles.title}
          />
        )}
      </View>
      <View style={styles.rightContainer}>
        {!isGuest ? (
          <CircularIcon
            type={'svg'}
            SVGComponent={() => <EmailIcon />}
            onPress={openMessages}
            countIndicator={unreadMessages}
            style={{backgroundColor: colors.white}}
            emailIcon={true}
            accessible={isAccessibilityEnabledOnHomeScreen}
            accessibilityLabel={'Notifications'}
            accessibilityRole={'button'}
            accessibilityValue={{text: unreadMessages > 0  ? `${unreadMessages} unread notifications`: ''}}
            accessibilityHint={'activate to pen Notifications Screen'}
          />
        ) : null}
        <CircularIcon
          type={'svg'}
          countIndicator={sum}
          onPress={openCart}
          SVGComponent={() => <Cart />}
          style={{marginStart: 10}}
          accessible={isAccessibilityEnabledOnHomeScreen}
          accessibilityValue={{text: sum > 0 ? `${sum} items` : ''}}
          accessibilityLabel={'Shopping bag'}
          accessibilityRole={'button'}
          accessibilityHint={'activate to open Shopping bag Screen'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0)',
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: SCREEN_WIDTH * 0.58,
  },
  menuIcon: {
    alignSelf: 'center',
    width: 20,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textTransform: 'uppercase',
    alignSelf: 'center',
    marginStart: 5,
  },
  rightContainer: {
    flexDirection: 'row',
    width: '39%',
    justifyContent: 'flex-end',
    paddingEnd: getMScale(10),
  },
});
export default DrawerHeader;
