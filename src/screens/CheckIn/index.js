import {Image, ScrollView, View} from 'react-native';
import RText from '../../components/RText';
import {constants, strings} from '../../constants';
import styles from './styles';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import InputField from '../../components/InputField';
import RButton from '../../components/RButton';
import useCheckInHook from './useCheckInHook';

const CheckIn = () => {
  const {
    providerToken,
    barCodeError,
    isLoading,
    handelBarCodeChange,
    onSubmit,
    maskedBarCode,
    loadingCheckIn,
  } = useCheckInHook();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps={'handled'}>
      <RText text={strings.check_in} textStyle={styles.heading} />
      <RText text={strings.check_in_des_1} textStyle={styles.description} />
      <View style={styles.qrcodeContainer}>
        <QRCode size={200} value={providerToken?.user?.user_as_qrcode} />
      </View>

      <Image
        style={styles.image}
        source={require('../../assets/images/receipt_rewards.png')}
      />

      <RText text={strings.forgot_to_checkout} textStyle={styles.heading} />
      <RText text={strings.check_in_des_2} textStyle={styles.description} />
      <InputField
        isMaskedInput
        key={'barcode'}
        placeholder={'xx-xxx-xxx-xxxx-x'}
        value={maskedBarCode}
        keyboardType={constants.KEYBOARD_TYPES.NUMBER_PAD}
        onChangeText={handelBarCodeChange}
        error={barCodeError}
      />
      <RText text={strings.check_in_des_3} textStyle={styles.description} />

      <RButton
        onPress={onSubmit}
        title={strings.submit}
        disabled={isLoading && loadingCheckIn}
        loading={isLoading && loadingCheckIn}
      />
    </ScrollView>
  );
};

export default CheckIn;
