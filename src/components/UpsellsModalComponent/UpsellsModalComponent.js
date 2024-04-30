import {FlatList, Platform, Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import RButton from '../RButton';
import React from 'react';
import useUpsellsModal from './useUpsellsModal';
import {strings} from '../../constants';
import RText from '../RText';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
import CrossIcon from '../../assets/svgs/CrossIcon';
import UpsellsItem from '../UpsellsItemCard/UpsellsItem';

const UpsellsModalComponent = ({onClose, selectedCategory}) => {
  const {
    products,
    onSubmit,
    handleQtyChange,
    isDisabledButton,
    selectedItemForQty,
    onPressGreenPlusIcon,
  } = useUpsellsModal({
    selectedCategory,
    onClose,
  });

  const renderSalsaItems = ({item}) => {
    return (
      <UpsellsItem
        item={item}
        onQtyChange={handleQtyChange}
        onPressPlusIcon={onPressGreenPlusIcon}
        selected={selectedItemForQty.includes(item.id)}
        isSalsaItem
        containerStyle={{marginEnd: getMScale(15)}}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <RText
          accessible
          accessibilityRole={'header'}
          text={'Add Free Salsa'}
          weight={'headerBold'}
          size={'lg'}
          textStyle={styles.listHeader}
        />
        <Pressable
          accessible
          accessibilityRole={'button'}
          accessibilityHint={'activate to close this modal sheet'}
          hitSlop={15}
          onPress={() => onClose?.()}
          style={styles.crossIcon}>
          <CrossIcon />
        </Pressable>
      </View>
    );
  };

  const renderListHeader = () => (
    <RText
      text={'Max 6 items per flavor'}
      size={'xs'}
      color={colors.subTitleText}
      textStyle={{marginVertical: getVerticalScale(23), marginHorizontal: getMScale(20)}}
    />
  );

  const renderListFooter = () => (
    <View style={styles.buttonContainerStyle}>
      <RButton
        accessible
        accessibilityHint={'activate to add free salsa'}
        title={strings.done}
        disabled={!!isDisabledButton}
        onPress={onSubmit}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );
  return (
    <View style={styles.modalBodyContainer}>
      {renderHeader()}
      <FlatList
        data={products}
        numColumns={3}
        renderItem={renderSalsaItems}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContainer}
        style={{flex:1}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalBodyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: getVerticalScale(62),
    alignItems: 'center',
    backgroundColor: colors.bottomSheetHeaderColor,
    justifyContent: 'center',
  },
  crossIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    position: 'absolute',
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  listContainer: {flexGrow: 1, paddingBottom: 40},
  buttonTitleStyle: {textTransform: 'uppercase'},
  buttonContainerStyle: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: getVerticalScale(16),
  },
  buttonStyle: {
    width: '80%',
    alignSelf: 'center',
  },
  circularItem: {
    flex: 1,
    // width: getMScale(130),
    alignItems: 'center',
    marginBottom: getVerticalScale(37),
  },
  circularView: {
    width: getMScale(66),
    height: getMScale(66),
    borderRadius: getMScale(33),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  itemName: {
    marginTop: getMScale(8),
    lineHeight: 17.5,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  iconContainer: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        right: getScale(25),
      },
      android: {
        right: getMScale(28),
      },
    }),
    top: 3,
    zIndex: 1,
  },
  quantitySelector: {
    backgroundColor: colors.white,
    width: getMScale(87),
    height: getVerticalScale(26),
    position: 'absolute',
    top: 0,
    zIndex: 22,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 14,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  rightQtyView: {
    borderLeftColor: 'rgba(142, 142, 147, 0.3)',
    borderLeftWidth: 1,
    paddingHorizontal: 10,
  },
  quantityText: {alignSelf: 'center', lineHeight: 22},
  leftQtyView: {
    borderRightColor: 'rgba(142, 142, 147, 0.3)',
    borderRightWidth: 1,
    paddingHorizontal: 10,
  },
  listHeader: {textTransform: 'uppercase'},
});
export default UpsellsModalComponent;
