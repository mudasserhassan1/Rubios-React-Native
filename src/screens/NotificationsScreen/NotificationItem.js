import React from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';

import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import RText from '../../components/RText';
import {colors} from '../../theme';
import styles from './styles';
import {NotificationItemLoading} from './NotificationItemLoading';

const NotificationItem = ({
  item,
  canDismiss,
  onPress,
  renderActionButton,
  onDismissPress,
  dismissLoading,
}) => {
  const {cta = [], title = '', body = '', read_at, message_type} = item || {};

  if (dismissLoading) {
    return (
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          backgroundColor: colors.white,
          marginStart: 40,
          marginTop: 8,
          alignItems: 'center',
        }}>
        <NotificationItemLoading />
      </View>
    );
  }
  return (
    <TouchableOpacity
      accessible
      accessibilityHint={'activate to open Notification Message sheet.'}
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.messageItemParent,
        !read_at && message_type === 'user_specific' && {backgroundColor: '#E9E9E9'},
      ]}>
      <ImageComponent source={images.notification_icon} style={styles.notificationIcon} />
      <View style={[styles.midContainer, cta?.length === 0 && {width: '80%'}]}>
        <RText text={title?.trim()} size={'xs'} weight={'semiBold'} />
        <RText
          size={'xs'}
          text={body.split('.')?.slice(0, 1)?.join('.')}
          numberOfLines={3}
          textStyle={styles.description}
        />
        {canDismiss ? (
          <Pressable
            accessible
            accessibilityHint={'double tap to dismiss this.'}
            onPress={onDismissPress}>
            <RText
              size={'xxs'}
              color={colors.primaryLink}
              text={'Dismiss'}
              textStyle={{textDecorationLine: 'underline', marginTop: 5}}
            />
          </Pressable>
        ) : null}
      </View>
      {renderActionButton(cta)}
    </TouchableOpacity>
  );
};
export default NotificationItem;
