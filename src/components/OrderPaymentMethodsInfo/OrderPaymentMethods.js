import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import RText from '../RText';
import useOrderPaymentMethods from './useOrderPaymentMethods';
import RButton from '../RButton';
import {strings} from '../../constants';
import AddGiftCardModalJSX from '../AddGiftCardModalJSX/AddGiftCardModalJSX';
import PaymentCardItem from '../PaymentCardItem/PaymentCardItem';
import {colors} from '../../theme';
import BottomSheetModalComponent from '../BottomSheetModal/BottomSheetModalComponent';
import PlaceholderPaymentMethods from './PlaceholderPaymentMethods';
import {getVerticalScale} from '../../theme/metrics';

const OrderPaymentMethods = ({
  disabled,
  onCardPress,
  showCreditCardSheet,
  showGiftCardSheet,
  showGiftCardListSheet,
    placingOrder,
}) => {
  const {
    remainingOrderAmount,
    isAddCreditCardVisible,
    isAddGiftCardVisible,
    selectedBillingSchemes,
    showCardsList,
    hideCreditOrGiftCardModal,
    showAddAnotherPaymentMessage,
    userDataLoading,
    isSelectGiftCardVisible,
    isChangePaymentMethodVisible,
  } = useOrderPaymentMethods({placingOrder});

  const renderCardsList = () => {
    if (showCardsList) {
      return selectedBillingSchemes.map((card, index) => {
        return (
          <PaymentCardItem
            showChargeAmount
            key={String(index)}
            handleCardPress={onCardPress}
            card={card}
            onEditPress={showCreditCardSheet}
          />
        );
      });
    }
    return null;
  };

  const renderAddCreditCardView = () => {
    if (isAddCreditCardVisible) {
      return (
        <RButton
          accessibilityHint={'activate to open Add a Credit/Debit card modal.'}
          title={strings.add_credit_Card}
          onPress={showCreditCardSheet}
          buttonStyle={styles.addCreditCardButton}
          disabled={disabled}
          titleStyle={styles.buttonTitleStyle}
        />
      );
    }
    return null;
  };

  const renderAddAnotherPaymentMethod = () => {
    if (isChangePaymentMethodVisible) {
      return (
        <TouchableOpacity accessibilityRole={'button'} accessibilityHint={'activate to open saved credit cards list modal'} onPress={() => onCardPress('creditcard')} style={styles.addGiftCardView}>
          <RText
            text={'Select Credit/Debit Card'}
            weight={'headerBold'}
            size={'xs'}
            textStyle={styles.addGiftCardText}
            color={colors.secondary}
          />
        </TouchableOpacity>
        // <RButton
        //   title={strings.change_payment_method}
        //   onPress={() => onCardPress('creditcard')}
        //   buttonStyle={styles.addCreditCardButton}
        //   disabled={disabled}
        //   titleStyle={styles.buttonTitleStyle}
        // />
      );
    }
    return null;
  };
  const renderAddGiftCardView = () => {
    if (isAddGiftCardVisible || isSelectGiftCardVisible) {
      return (
        <TouchableOpacity
            accessibilityRole={'button'}
            accessibilityHint={isSelectGiftCardVisible ? 'activate to open gift cards list modal' : 'activate to open add gift card modal'}
          onPress={() =>
            isSelectGiftCardVisible ? showGiftCardListSheet?.() : showGiftCardSheet?.()
          }
          style={styles.addGiftCardView}>
          <RText
            text={isSelectGiftCardVisible ? 'Select a Gift Card' : 'Add a Gift Card'}
            weight={'headerBold'}
            size={'xs'}
            textStyle={styles.addGiftCardText}
            color={colors.secondary}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderAddCardsModal = () => {
    return (
      <BottomSheetModalComponent snapIndex={0} snapPoints={['40%']}>
        <AddGiftCardModalJSX onClose={hideCreditOrGiftCardModal} />
      </BottomSheetModalComponent>
    );
  };

  return (
    <View style={styles.paymentViewParent}>
      <RText weight={'semiBold'} accessibilityRole={'header'}  size={'xs'} text={'Payment Methods'} />
      {userDataLoading ? (
        <PlaceholderPaymentMethods />
      ) : (
        <>
          {renderCardsList()}
          {showAddAnotherPaymentMessage ? (
            <RText
              textStyle={{textAlign: 'center', color: colors.error}}
              text={'Please add another payment method to complete your purchase.'}
            />
          ) : null}
          <RText
            textStyle={{alignSelf: 'center', marginTop: getVerticalScale(10)}}
            size={'xs'}
            text={`Remaining Amount: $ ${parseFloat(remainingOrderAmount).toFixed(2)}`}
          />
          {renderAddAnotherPaymentMethod()}
          {renderAddCreditCardView()}
          {renderAddGiftCardView()}
        </>
      )}
      {renderAddCardsModal()}
    </View>
  );
};
export default OrderPaymentMethods;
