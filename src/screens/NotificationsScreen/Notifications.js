import {Pressable, View} from 'react-native';
import RText from '../../components/RText';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {getMessagesSuccess} from '../../redux/actions/messages';
import {FlashList} from '@shopify/flash-list';
import {colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import BottomSheetHeader from '../../components/BottomSheetHeader/BottomSheetHeader';
import MenuScreenHeader from '../../components/MenuScreenHeader/MenuScreenHeader';
import RButton from '../../components/RButton';
import NotificationsLoading from './NotificationItemLoading';
import {navigateTo} from '../../utils/navigationUtils';
import {screens} from '../../constants';
import {Screen} from '../../components/Screen';
import styles from './styles';
import NotificationItem from './NotificationItem';
import {dismissMessage, markMessagesAsRead} from '../../services/messages';
import {logToConsole} from '../../configs';
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";

const CTA_TYPES = {
  ORDER_NOW: 'Order Now',
  GET_DIRECTIONS: 'Get Directions',
  FIND_A_LOCATION: 'Find a Location',
};
const Notifications = ({route}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dismissLoading, setDismissLoading] = useState(false);

  const dispatch = useDispatch();

  const bottomSheetRef = useRef();
  const {messages = [], loading} = useSelector(state => state.messagesReducer);

  useEffect(() => {
    markAllAsRead().then();
  }, []);
  const handleDismiss = async item => {
    bottomSheetRef?.current?.closeSheet();
    dispatch(
      getMessagesSuccess({messages: messages.filter(msg => msg?.message_id !== item.message_id)}),
    );
    try {
      await dismissMessage(item?.message_id);
      setDismissLoading(false);
    } catch (e) {
      logToConsole({handleDismiss: e.response});
      setDismissLoading(false);
    }
  };

  const markAllAsRead = async () => {
    const allMessagesIds = messages.filter(item =>  !item.read_at).map(item => String(item?.message_id)).join(',');
    await markMessagesAsRead(allMessagesIds);
  };
  const getDismissOption = item => {
    return {canDismiss: item?.dismissable && item?.message_type === 'user_specific'};
  };

  const snapPoints = useMemo(() => ['93%'], []);

  const onCTAPress = label => {
    switch (label) {
      case CTA_TYPES.ORDER_NOW:
        navigateTo(screens.CHOOSE_ORDER_TYPE);
        break;
      case CTA_TYPES.GET_DIRECTIONS:
        navigateTo(screens.CHOOSE_ORDER_TYPE);
        break;
      case CTA_TYPES.FIND_A_LOCATION:
        navigateTo(screens.CHOOSE_ORDER_TYPE);
        break;
      default:
        break;
    }
  };

  const handleMessagePress = item => {
    setSelectedNotification(item);
    bottomSheetRef?.current?.openSheet();
    const updatedMessages = messages.map(msg => {
      if (item?.message_id === msg?.message_id) {
        msg.read_at = new Date().toISOString();
      }
      return msg;
    });
    dispatch(getMessagesSuccess({messages: updatedMessages}));
  };

  const renderActionButton = (cta = []) => {
    if (cta?.length > 0) {
      return (
        <Pressable
          style={styles.messageItemActionButton}
          hitSlop={15}
          onPress={() => onCTAPress(cta?.[0]?.label)}>
          <RText
            text={cta?.[0].label}
            color={cta?.[0]?.cta_type === 'primary' ? colors.primaryLink : colors.primary}
            size={'xxs'}
            textStyle={styles.actionButtonTitle}
          />
        </Pressable>
      );
    }
    return null;
  };
  const renderMessagesItem = ({item}) => {
    const {canDismiss} = getDismissOption(item);
    return (
      <NotificationItem
        item={item}
        canDismiss={canDismiss}
        renderActionButton={renderActionButton}
        onPress={() => handleMessagePress(item)}
        onDismissPress={() => {
          setSelectedNotification(item);
          handleDismiss(item);
        }}
        dismissLoading={dismissLoading && selectedNotification?.message_id === item?.message_id}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (loading) {
      return <NotificationsLoading />;
    }
    return (
      <View style={styles.listEmptyView}>
        <ImageComponent style={styles.listEmptyIcon} source={images.notification_icon} />
        <RText text={'No notifications at the moment!'} />
      </View>
    );
  };

  const renderBottomSheet = () => {
    const {canDismiss} = getDismissOption(selectedNotification);
    return (
      <BottomSheetModalComponent
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        hideHandleBar={true}
        snapIndex={0}>
        <BottomSheetHeader title={'Message'} onClose={bottomSheetRef?.current?.closeSheet} />
        <BottomSheetScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
          <View style={styles.modalBodyContainer}>
            <ImageComponent
                style={{width: '100%', aspectRatio: 1 / 0.77}}
                source={{uri: selectedNotification?.hero_content?.url}}
                resizeMode={'cover'}
            />
            <RText
                text={selectedNotification?.title}
                weight={'bold'}
                size={'lg'}
                textStyle={{marginTop: getMScale(15), marginHorizontal: getMScale(10)}}
            />
            <RText
                text={selectedNotification?.body}
                size={'xs'}
                textStyle={{marginTop: getVerticalScale(20), marginHorizontal: getMScale(10)}}
            />
          </View>
          {canDismiss ? (
            <Pressable
              style={{alignSelf: 'center', marginBottom: getVerticalScale(20)}}
              accessible
              accessibilityHint={'double tap to dismiss this.'}
              hitSlop={20}
              onPress={() => handleDismiss(selectedNotification)}>
              <RText
                size={'xxs'}
                color={colors.primaryLink}
                text={'Dismiss'}
                textStyle={{textDecorationLine: 'underline', marginTop: 5}}
              />
            </Pressable>
          ) : null}
          {selectedNotification?.cta?.length > 0 ? (
              <RButton
                  accessibilityHint={`double tap top open ${selectedNotification?.cta?.[0]?.label}`}
                  title={selectedNotification?.cta?.[0]?.label || ''}
                  buttonStyle={{
                    // position: 'absolute',
                    alignSelf: 'center',
                    // bottom: getVerticalScale(40),
                  }}
                  onPress={() => onCTAPress(selectedNotification?.cta?.[0]?.label)}
              />
          ) : null}
        </BottomSheetScrollView>
      </BottomSheetModalComponent>
    );
  };
  return (
    <Screen containerStyle={styles.parent} backgroundColor={colors.white} withHeader>
      <MenuScreenHeader showCartIcon={false} screenTitle={'NOTIFICATIONS'} route={route} />
      <View style={styles.listContainer}>
        <FlashList
          data={messages}
          renderItem={renderMessagesItem}
          ListEmptyComponent={renderListEmptyComponent}
          estimatedItemSize={100}
          contentContainerStyle={{flex: 1, paddingBottom: getMScale(30)}}
          keyExtractor={(_, index) => index.toString()}
          extraData={dismissLoading || selectedNotification}
        />
      </View>
      {renderBottomSheet()}
    </Screen>
  );
};
export default Notifications;
