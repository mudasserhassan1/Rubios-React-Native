import React, {useRef} from 'react';
import {View} from 'react-native';
import RText from '../RText';
import styles from '../../screens/LocationScreen/styles';
import {constants, strings} from '../../constants';
import InputField from '../InputField';
import RButton from '../RButton';
import useAddEditAddressModal, {INPUT_KEYS} from './useAddEditAddressModal';

const EditAddressModalJSX = ({
  onClose,
  selectedAddress,
  isAddNew,
  onCloseModal,
  onTapConfirm,
  isModalView = true,
}) => {
  const {address1, address2, city, zip, error, handleInputChange, onConfirmPress, onCancelPress} =
    useAddEditAddressModal({
      selectedAddress,
      onCloseModal,
      onClose,
      isAddNew,
      onTapConfirm,
    });

  const ref_streetAddress = useRef();
  const ref_apt_floor = useRef();
  const ref_city = useRef();
  const ref_postalCode = useRef();

  return (
    <View style={{backgroundColor: 'white', padding: 10}}>
      {isModalView ? <RText textStyle={styles.title} text={strings.delivery_address} /> : null}
      <InputField
        ref={ref_streetAddress}
        placeholder={strings.street_address}
        key={strings.street_address}
        value={address1}
        onChangeText={text => handleInputChange(text, INPUT_KEYS.ADDRESS_1)}
        blurOnSubmit={false}
        error={error[INPUT_KEYS.ADDRESS_1]}
        onSubmitEditing={() => ref_apt_floor.current?.focus()}
      />
      <InputField
        ref={ref_apt_floor}
        placeholder={strings.apt_floor_suite_building_companyaddress}
        key={strings.add_address}
        value={address2}
        onChangeText={text => handleInputChange(text, INPUT_KEYS.ADDRESS_2)}
        blurOnSubmit={false}
        error={error[INPUT_KEYS.ADDRESS_2]}
        onSubmitEditing={() => ref_city.current?.focus()}
      />
      <InputField
        ref={ref_city}
        placeholder={strings.city}
        key={strings.city}
        value={city}
        onChangeText={text => handleInputChange(text, INPUT_KEYS.CITY)}
        blurOnSubmit={false}
        error={error[INPUT_KEYS.CITY]}
        onSubmitEditing={() => ref_postalCode.current?.focus()}
      />

      <InputField
        ref={ref_postalCode}
        placeholder={strings.postal_code}
        key={strings.postal_code}
        value={zip}
        onChangeText={text => handleInputChange(text, INPUT_KEYS.ZIP)}
        error={error[INPUT_KEYS.ZIP]}
        keyboardType={constants.KEYBOARD_TYPES.DECIMAL_PAD}
        returnKeyType={'done'}
      />

      <View style={{flexDirection: 'row'}}>
        <RButton
          title={isAddNew ? strings.add_address : strings.confirm}
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitleStyle}
          onPress={onConfirmPress}
        />
        <RButton
          title={strings.cancel}
          buttonStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitleStyle}
          onPress={onCancelPress}
        />
      </View>
    </View>
  );
};

export default React.memo(EditAddressModalJSX);
