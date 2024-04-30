import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import {constants, strings} from '../../constants';
import React, {useState} from 'react';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import RText from '../../components/RText';
import RButton from '../../components/RButton';
import InputField from '../../components/InputField';
import AddToFavCrossIcon from '../../assets/svgs/AddToFavCrossIcon';
import {createFave} from '../../redux/actions/create-fave';
import {useDispatch} from 'react-redux';
const AddToFavBottomSheet = ({
  TitleImage,
  title,
  closeBottomSheet,
  bottomSheetRef,
  favOrderId,
  nickname,
}) => {
  const [favName, setFavName] = useState(nickname ? nickname : '');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const renderHeaderView = () => {
    return (
      <TouchableOpacity style={styles.header} onPress={closeBottomSheet} activeOpacity={0.7}>
        <AddToFavCrossIcon />
      </TouchableOpacity>
    );
  };
  const doFavOrder = () => {
    setLoading(true);
    Keyboard.dismiss();
    const payload = {
      order: {
        orderref: '',
        id: favOrderId,
        ignoreunavailableproducts: true,
      },
      basket: {
        description: favName,
        isdefault: false,
      },
    };
    const successCallback = status => {
      if (status === 'success') {
        setFavName('');
        setLoading(false);
        bottomSheetRef?.current?.closeSheet();
      } else {
        setLoading(false);
      }
    };
    dispatch(createFave(payload, successCallback));
  };
  return (
    <View style={styles.contentContainer}>
      {renderHeaderView()}
      <View style={styles.modalTopImageStyle}>
        <TitleImage />
      </View>
      <RText
        text={title}
        color={colors.primary}
        weight={'headerBold'}
        size={'lg'}
        textStyle={styles.titleTextStyle}
      />

      <InputField
        placeholder={strings.fav_order_name_placeholder}
        value={favName}
        onChangeText={text => setFavName(text)}
        blurOnSubmit={false}
        isBottomSheetInput
        returnKeyType={'done'}
        onSubmitEditing={Keyboard.dismiss}
        keyboardType={constants.KEYBOARD_TYPES.DEFAULT}
      />
      <RButton
        onPress={doFavOrder}
        title={strings.save}
        disabled={favName?.length === 0}
        buttonStyle={styles.createAccountBtn}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
    borderRadius: 60,
    backgroundColor: colors.white,
    width: 32,
    marginTop: 10,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: getMScale(16),
  },
  modalTopImageStyle: {
    marginTop: getMScale(-15),
    backgroundColor: colors.white,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextStyle: {
    marginTop: getMScale(24),
    paddingHorizontal: getMScale(16),
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 24,
  },
  createAccountBtn: {width: '75%', marginTop: getVerticalScale(32)},
});
export default React.memo(AddToFavBottomSheet);
