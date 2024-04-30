import React from 'react';
import {getMScale} from '../../theme/metrics';
import {colors} from '../../theme';
import {ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../../components/RText';
import DeleteSeaGreenIcon from '../../assets/svgs/DeleteSeaGreenIcon';
import {useCallback} from 'react';
import VisaIcon from '../../assets/svgs/VisaIcon';
import MasterCardIcon from '../../assets/svgs/MasterCardIcon';
import {useState} from 'react';
import CheckBox from '../../components/CheckBox/CheckBox';
import {useDispatch} from 'react-redux';
import {deleteBillingAccount, updateBillingAccount} from '../../redux/actions/user';
import AmexIcon from '../../assets/svgs/AmexIcon';
import DiscoverIcon from "../../assets/svgs/DiscoverIcon";

const CreditCardItem = ({card}) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isMakeDefaultLoading, setIsMakeDefaultLoading] = useState(false);

  const onDefaultPressed = value => {
    if (value) {
      setIsMakeDefaultLoading(true);
      const obj = {
        isdefault: true,
      };
      dispatch(updateBillingAccount(obj, accountid, () => setIsMakeDefaultLoading(false)));
    }
  };

  const dispatch = useDispatch();

  const onDeletePress = () => {
    Alert.alert(
      'Remove Payment Method',
      `${cardtype} ending in ${cardsuffix} will be removed from your Rubio's account.`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            setIsDeleteLoading(true);
            dispatch(deleteBillingAccount(accountid, () => setIsDeleteLoading(false)));
          },
        },
      ],
    );
  };
  const {isdefault, cardtype, cardsuffix, accountid} = card || {};
  const renderCardImage = useCallback(() => {
    switch (cardtype) {
      case 'Visa':
        return <VisaIcon />;
      case 'Mastercard':
        return <MasterCardIcon />;
      case 'Amex':
        return <AmexIcon />;
      case 'Discover':
        return <DiscoverIcon />;
      default:
        return <VisaIcon />;
    }
  }, [cardtype]);

  return (
    <View
      style={styles.parentView}>
      <View style={styles.cardImageAndLastFour}>
        {isdefault ? (
          <RText
            text={'Default Card'}
            size={'xs'}
            weight={'semiBold'}
            textStyle={styles.defaultText}
          />
        ) : null}
        <View
          style={styles.imageAndLastFour}>
          {renderCardImage(cardtype)}
          <RText text={`**** ${cardsuffix}`} size={'xs'} />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '50%',
            columnGap: 10,
          alignItems: 'center',
          marginEnd: getMScale(16),
        }}>
        <View style={{width: '85%'}}>
          {isMakeDefaultLoading ? (
            <ActivityIndicator size={'small'} color={colors.secondary} />
          ) : !isdefault ? (
            // <TouchableOpacity style={{flexDirection: 'row'}}>
            //   <CheckBoxImage />
            //   <RText text={'Make Default'} />
            // </TouchableOpacity>
            <CheckBox
              text={'Make Default'}
              // checked={isDefaultChecked}
              textSize={'xs'}
              width={16}
              height={16}
              onValueChange={val => onDefaultPressed(val)}
            />
          ) : null}
        </View>
        <TouchableOpacity
          onPress={onDeletePress}
          disabled={isDeleteLoading}
          style={{alignSelf: 'center'}}>
          {isDeleteLoading ? (
            <ActivityIndicator color={colors.secondary} size={'small'} />
          ) : (
            <DeleteSeaGreenIcon />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    parentView: {
        padding: getMScale(16),
        backgroundColor: colors.white,
        borderRadius: getMScale(12),
        flexDirection: 'row',
        marginBottom: getMScale(10),
        marginHorizontal: getMScale(15),
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 7,
        shadowOpacity: 0.1,
        shadowColor: colors.black,
        elevation: 3,
        justifyContent: 'space-between',
    },
    cardImageAndLastFour: {width: '50%'},
    defaultText: {marginBottom: getMScale(8)},
    imageAndLastFour: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: getMScale(5)
    },
})
export default React.memo(CreditCardItem);
