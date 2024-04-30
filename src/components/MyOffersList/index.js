import React from 'react';
import {FlatList, Keyboard, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import RText from '../RText';
import {getMScale} from '../../theme/metrics';
import MyOffersEmptyComponent from '../MyOffersEmptyComponent';
import {navigateTo} from '../../utils/navigationUtils';
import {constants, screens} from '../../constants';
import ImageComponent from '../ImageComponent/ImageComponent';
import {formatDateTime} from '../../utils/timeUtils';
import useFirebaseConfigSelector from "../../hooks/reduxStateHooks/useFirebaseConfigSelector";

const HorizontalFlatListItem = ({imageUrl, expiryDate, text1, text2, onOrderBtnPress, item, onTermsAndConditionsPress}) => (
  <View style={styles.itemContainer}>
    <ImageComponent source={{uri: imageUrl}} style={styles.image} resizeMode={'cover'} />
    <View style={styles.expiryDate}>
      <RText
        text={'Expires: ' + formatDateTime(expiryDate, constants.TIME_FORMAT.MDY_SLASH)}
        size={'xxs'}
        textStyle={{fontStyle:'italic'}}
        color={colors.expiryDateColor}
      />
    </View>

    <View style={styles.bottomViewWrapper}>
      <View style={{height: getMScale(45)}}>
        <RText
          text={text1}
          color={colors.primary}
          size={'xxs'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          weight={'semiBold'}
          textStyle={{lineHeight: 17.5, letterSpacing: 0.15}}
        />
        <RText
          text={text2}
          color={colors.primary}
          size={'xxs'}
          numberOfLines={2}
          ellipsizeMode={'tail'}
          textStyle={{lineHeight: 12, letterSpacing: 0.15, marginTop: getMScale(6)}}
        />
      </View>

      <View
        style={{
          marginTop: getMScale(15),
          flexDirection: 'row',
          marginBottom: getMScale(5),
        }}>
        <TouchableOpacity
          disabled={false}
          activeOpacity={0.7}
          onPress={() =>
            goToQRCodeForReward(
              item?.reward_id,
              item?.name,
              'reward',
              true,
              item?.description,
              item?.reward_image_url,
              item?.expiring_at,
            )
          }>
          <View style={styles.itemBottomView}>
            <RText
              color={colors.secondary}
              weight={'headerBold'}
              text={'Scan in Store'}
              size={'xxs'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{top: 15, bottom: 15, left: 10, right: 10}}
          disabled={false}
          activeOpacity={0.7}
          onPress={onOrderBtnPress}>
          <View style={styles.orderBtnView}>
            <RText color={colors.white} weight={'headerBold'} text={'Order'} size={'xxs'} />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onTermsAndConditionsPress}>
        <RText
          text={'See Terms'}
          color={colors.primaryLink}
          size={'xxs'}
          textStyle={{
            marginTop: getMScale(10),
            marginBottom: getMScale(15),
            textDecorationLine: 'underline',
          }}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const goToQRCodeForReward = (id, name, type, isAllow, description, rewardImage, expiry) => {
  if (isAllow) {
    navigateTo(screens.REWARD_QR_CODE, {
      id: id,
      name: name,
      type: type,
      description,
      rewardImage,
      expiry,
    });
  }
};
const HorizontalFlatList = ({data, onOrderBtnPress}) => {

  const {terms_and_conditions_url} = useFirebaseConfigSelector();

  const onTermOfUsePress = () => {
    Keyboard?.dismiss();
    Linking?.canOpenURL(terms_and_conditions_url).then(supported => {
      if (supported) {
        Linking?.openURL(terms_and_conditions_url);
      }
    });
  };

  const renderItem = ({item}) => (
    <HorizontalFlatListItem
      imageUrl={item?.reward_image_url}
      expiryDate={item?.expiring_at}
      text1={item?.name}
      text2={item?.description}
      onOrderBtnPress={onOrderBtnPress}
      item={item}
      onTermsAndConditonsPress = {onTermOfUsePress}
    />
  );

  const renderEmptyComponent = () => {
    return (
      <MyOffersEmptyComponent
        titleText={'Your offers are \n' + 'still cooking....'}
        titleFontSize={'xs'}
        titleWeight={'semiBold'}
        containerStyle={{marginVertical: 5, paddingHorizontal: getMScale(5)}}
      />
    );
  };
  return (
    <FlatList
      horizontal
      data={data}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyComponent}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    paddingVertical: 12,
  },
  itemContainer: {
    width: getMScale(298),
    marginRight: getMScale(16),
    borderRadius: getMScale(8),
    backgroundColor: colors.white,
  },
  image: {
    width: '100%',
    height: getMScale(140),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  expiryDate: {
    position: 'absolute',
    top: 110,
    right: 8,
    color: '#fff',
    backgroundColor: colors.white,
    paddingVertical: getMScale(4),
    paddingHorizontal: getMScale(8),
    borderRadius: getMScale(6),
    fontStyle: 'italic',
    letterSpacing: 0.15,
    lineHeight: 17,
  },
  text: {
    marginVertical: 8,
  },
  itemBottomView: {
    backgroundColor: colors.white,
    height: getMScale(24),
    width: getMScale(132),
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderBtnView: {
    backgroundColor: colors.secondaryColor,
    height: getMScale(24),
    width: getMScale(85),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: getMScale(12),
  },
  bottomViewWrapper: {
    height: getMScale(125),
    marginHorizontal: getMScale(16),
    marginVertical: getMScale(10),
  },
});

export default HorizontalFlatList;
