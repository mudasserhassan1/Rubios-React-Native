import React from 'react';
import {styles} from './styles';
import {Alert, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {strings} from '../../constants';
import useDeliveryAddressHook from './useDeliveryAddressHook';
import {colors} from '../../theme';
import RText from '../../components/RText';
import {Screen} from '../../components/Screen';
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader';
import DeliveryAddressComponent from '../../components/DeliveryAddressComponent';
import DefaultAddressIcon from '../../assets/svgs/DefaultAddressIcon';
import NonDefaultAddressIcon from '../../assets/svgs/NonDefaultAddressIcon';
import {getMScale} from '../../theme/metrics';
import CardLoader from './CardLoader';
import LoadingOverlay from '../../components/LoadingComponent/SpinnerOverly';

const DeliveryAddress = () => {
  const {
    deleteAddressHandler,
    defaultAddressHandler,
    isDefaultPresent,
    deliveryaddresses,
    deliveryAddressesLoading,
    loading,
    setLoading,
    renderOnStart,
  } = useDeliveryAddressHook();

  const onConsent = item => {
    Alert.alert(
      'Remove Delivery Address',
      "The delivery address will no longer be will be available on your Rubio's account",
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            setLoading(true);
            deleteAddressHandler(item);
          },
        },
      ],
    );
  };

  const ListHeaderComponent = () => {
    return (
      <RText
        text={'My Delivery Address'}
        color={colors.primary}
        size={'md'}
        weight={'semiBold'}
        textStyle={styles.myDeliveryAddText}
      />
    );
  };

  const ListFooterCompnent = () => {
    return (
      <>
        {deliveryaddresses ? <View style={styles.greyHorizontalLineStyle} /> : null}
        <View style={styles.addNewDevileryAddress}>
          <RText
            text={strings.add_newDelivery_address_heading}
            color={colors.primary}
            weight={'semiBold'}
            size={'xs'}
            textStyle={{lineHeight: 18, letterSpacing: 0.15}}
          />
          <RText
            text={strings.add_newDelivery_address_subText}
            color={colors.primary}
            size={'xxs'}
            textStyle={{lineHeight: 18, letterSpacing: 0.15}}
          />
        </View>
      </>
    );
  };
  const renderContent = () => {
    if (deliveryAddressesLoading && !renderOnStart) {
      return <CardLoader />;
    }
    return (
      <FlashList
        data={deliveryaddresses}
        renderItem={ItemView}
        ListEmptyComponent={listEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterCompnent}
        contentContainerStyle={{flex: 1, justifyContent: 'center', paddingBottom: getMScale(100)}}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentWrapper}>
        <RText text={strings.no_addresses_string} textStyle={styles.emptyListTextStyle} />
      </View>
    );
  };

  const ItemView = ({item, index}) => {
    return (
      <View style={{marginHorizontal: getMScale(16)}}>
        <DeliveryAddressComponent
          Image={() => (item?.isdefault ? <DefaultAddressIcon /> : <NonDefaultAddressIcon />)}
          titleText={item?.isdefault ? 'Default Address' : ''}
          titleFontSize={'xs'}
          titleWeight={'bold'}
          subTitleSize={'xxs'}
          subTitle={item?.streetaddress + ', ' + item?.city + ', ' + item?.zipcode}
          deliveryAddressScreen
          makeDeafultAddress={() => defaultAddressHandler(item)}
          onEditPress={() => onConsent(item)}
          containerStyle={{marginVertical: 5, paddingHorizontal: getMScale(5)}}
          isDefault={item?.isdefault}
          index={index}
          isDefaultPresent={isDefaultPresent}
          deliveryAddressLength={deliveryaddresses?.length}
        />
      </View>
    );
  };

  return (
    <Screen
      preset={'fixed'}
      backgroundColor={colors.white}
      withHeader
      contentContainerStyle={{flex: 1}}>
      <ScreenHeader showCartButton={false} title={'Delivery Address'} />
      <View style={styles.container}>{renderContent()}</View>
      <LoadingOverlay isLoading={loading} />
    </Screen>
  );
};

export default DeliveryAddress;
