import {FlatList, ImageBackground, View} from 'react-native';
import RText from '../../components/RText';
import usePaymentMethodHooks from './usePaymentMethodHooks';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {colors} from '../../theme';
import Divider from '../../components/Divider';
import {images} from '../../assets';
import GiftCardIconLarge from '../../assets/svgs/GiftCardIconLarge';
import CreditCardItem from './CreditCardItem';
import PlaceholderGiftCards from './PlaceholderGiftCards';
import PlaceholderCreditCards from './PlaceholderCreditCards';
import {useCallback} from 'react';
import styles from './styles';

const PaymentMethodScreen = () => {
  const {creditCards, giftCards, isGiftCardLoading, userDataLoading, isLoadedOnce} =
    usePaymentMethodHooks();

  const renderCreditCards = ({item, index}) => {
    return (
      <>
        <CreditCardItem card={item} />
        {item?.isdefault && creditCards?.length > 1 ? (
          <RText
            text={'Other Payment Card'}
            size={'xxs'}
            textStyle={{marginVertical: getMScale(8), marginStart: getMScale(15)}}
          />
        ) : null}
        {index === creditCards?.length - 1 ? (
          <Divider style={{marginVertical: getMScale(14), width: '90%', alignSelf: 'center'}} />
        ) : null}
      </>
    );
  };

  const renderGiftCards = ({item}) => {
    return (
      <View
        style={{
          width: getMScale(206),
          height: getVerticalScale(194),
          borderRadius: getMScale(15),
          marginStart: getMScale(15),
          backgroundColor: colors.white,
          alignItems: 'center',
          padding: getMScale(8),
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowRadius: 7,
          shadowOpacity: 0.1,
          shadowColor: colors.black,
          elevation: 3,
        }}>
        <ImageBackground
          source={images.gift_card_bg}
          style={{
            borderRadius: getMScale(16),
            overflow: 'hidden',
            width: '100%',
            height: getVerticalScale(114),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <GiftCardIconLarge />
        </ImageBackground>
        <RText
          text={`Balance $${parseFloat(item.balance || '0').toFixed(2)}`}
          weight={'semiBold'}
          size={'md'}
          textStyle={{marginTop: getMScale(16)}}
        />
        <RText
          text={`******** ${item.cardsuffix}`}
          size={'xxs'}
          color={colors.palette.primary_50}
          textStyle={{marginTop: getMScale(8)}}
        />
      </View>
    );
  };

  const renderGiftCardsContainer = useCallback(() => {
    const giftCardsWithBalance = giftCards?.filter(item => item.balance && item?.balance > 0);
    return (
      <>
        {!isGiftCardLoading && giftCardsWithBalance.length === 0 ? null : (
          <RText text={'My Gift Cards'} weight={'semiBold'} textStyle={styles.gcListHeader} />
        )}
        <FlatList
          data={giftCardsWithBalance}
          renderItem={renderGiftCards}
          horizontal
          extraData={giftCards}
          ListEmptyComponent={() => {
            if (isGiftCardLoading) {
              return <PlaceholderGiftCards />;
            }
            return null;
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gcListContentContainer}
        />
        {giftCardsWithBalance?.length === 0 && !isGiftCardLoading ? null : (
          <Divider style={styles.gcListDivider} />
        )}
      </>
    );
  }, [giftCards, isGiftCardLoading]);

  const renderCreditCardsListFooter = useCallback(() => {
    return (
      <>
        {renderGiftCardsContainer()}
        <View style={styles.bottomMostView}>
          <RText
            text={'To Add a New Payment Method:'}
            size={'xs'}
            weight={'semiBold'}
            textStyle={styles.addNewPaymentMethodTitle}
          />
          <RText
            text={
              'Place your order as usual and enter your payment details on the checkout screen.'
            }
            size={'xxs'}
            textStyle={styles.descriptionText}
          />
        </View>
      </>
    );
  }, [renderGiftCardsContainer, giftCards, isGiftCardLoading]);

  if (userDataLoading && !isLoadedOnce.current) {
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <RText
          text={'Credit Cards'}
          weight={'semiBold'}
          size={'md'}
          textStyle={{marginVertical: getMScale(16), marginStart: getMScale(15)}}
        />
        <PlaceholderCreditCards />
      </View>
    );
  }
  return (
    <View style={styles.parent}>
      <FlatList
        data={creditCards}
        ListHeaderComponent={() => {
          if (creditCards.length === 0 && !userDataLoading) {
            return null;
          }
          return (
            <RText
              text={'Credit Cards'}
              weight={'semiBold'}
              size={'md'}
              textStyle={styles.ccListHeader}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderCreditCardsListFooter}
        renderItem={renderCreditCards}
        keyExtractor={item => item.accountid}
      />
    </View>
  );
};

export default PaymentMethodScreen;
