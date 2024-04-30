import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import RText from '../../components/RText';
import styles from './styles';
import {getMScale} from '../../theme/metrics';
import EditPencilIcon from '../../assets/svgs/EditPencilIcon';
import DeleteSeaGreenIcon from '../../assets/svgs/DeleteSeaGreenIcon';
import {strings} from '../../constants';
import CheckBox from '../UtensilCheckBox';

const DeliveryAddressComponent = ({
  Image,
  titleText,
  subTitle,
  onEditPress,
  containerStyle,
  titleFontSize,
  titleWeight,
  subTitleSize,
  isDefault,
  deliveryAddressScreen,
  index,
  makeDeafultAddress,
  showOtherAddressString,
  isDefaultPresent,
  deliveryAddressLength,
}) => {
  return (
    <>
      {isDefaultPresent && index === 1 && deliveryAddressScreen ? (
        <RText
          text={deliveryAddressLength === 2 ? 'Other Address' : 'Other Addresses'}
          color={colors.subTitleText}
          size={'xs'}
          textStyle={styles.otherAddress}
        />
      ) : (
        ''
      )}
      <View style={[styles.container, containerStyle]}>
        <View style={{paddingStart: 15}}>
          <Image />
        </View>

        <View style={{width: '65%', marginStart: getMScale(17)}}>
          {isDefault ? (
            <RText
              text={titleText}
              weight={titleWeight}
              size={titleFontSize}
              color={colors.primary}
              textStyle={styles.titleText}>
              {' '}
            </RText>
          ) : null}

          {subTitle ? (
            <>
              <RText
                text={subTitle}
                color={colors.primary}
                size={subTitleSize}
                numberOfLines={3}
                ellipsizeMode={'tail'}
                textStyle={styles.subTitleText}
              />

              {deliveryAddressScreen && !isDefault ? (
                <TouchableOpacity onPress={makeDeafultAddress}>
                  <View style={styles.makeDefault}>
                    <CheckBox
                      height={20}
                      width={20}
                      checked={false}
                      onValueChange={makeDeafultAddress}
                    />
                    <RText
                      text={strings.make_default}
                      color={colors.primary}
                      size={'xxs'}
                      textStyle={styles.makeDefaultTextStyle}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </>
          ) : null}
        </View>
        <TouchableOpacity
          accessible
          accessibilityHint={
            deliveryAddressScreen
              ? 'double tap to delete this address'
              : 'double tap tp edit this delivery address.'
          }
          style={{paddingEnd: 15}}
          onPress={onEditPress}>
          <View hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            {deliveryAddressScreen ? <DeleteSeaGreenIcon /> : <EditPencilIcon />}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default DeliveryAddressComponent;
