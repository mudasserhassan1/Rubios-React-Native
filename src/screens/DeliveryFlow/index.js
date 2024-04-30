import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {colors} from '../../theme';
import styles from './styles';
import React, {useCallback, useMemo} from 'react';
import {Keyboard, KeyboardAvoidingView, TouchableOpacity, View} from 'react-native';
import {images} from '../../assets';
import BottomSheet, {BottomSheetFlatList, KEYBOARD_BEHAVIOR} from '@gorhom/bottom-sheet';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import RText from '../../components/RText';
import {constants, strings} from '../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BackImage from '../../assets/svgs/BackImage';
import useDeliveryFlow from './useDeliveryFlow';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import DefaultAddressIcon from '../../assets/svgs/DefaultAddressIcon';
import DeliveryAddressComponent from '../../components/DeliveryAddressComponent';
import NonDefaultAddressIcon from '../../assets/svgs/NonDefaultAddressIcon';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import InputField from '../../components/InputField';
import CheckBox from '../../components/UtensilCheckBox';
import RButton from '../../components/RButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DefaultAdddressSmallIcon from '../../assets/svgs/DefaultAdddressSmallIcon';
import {isIos} from '../../utils/sharedUtils';
import DeliveryAddressLoading from './DeliveryAddressLoading';
import EmptyLocationListIcon from '../../assets/svgs/EmptyLocationListIcon';

const DeliveryFlow = () => {
  const {
    mCamera,
    selectedAddress,
    markers,
    searchVal,
    bottomSheetRef,
    handleSheetChanges,
    snapPoints1,
    snapPoints2,
    snapPoints3,
    isSearchActive,
    restaurantsLoading,
    searchLocations,
    onCurrentLocationPress,
    nearestRestaurantToLocation,
    handleClosePress,
    loading,
    isLoggedIn,
    deliveryAddressesList,
    googleAutoCompleteRef,
    ref_aptBuiilding,
    ref_zipCode,
    ref_city,
    handleStreetAddress,
    handleZipCode,
    handleCity,
    handleAptBuilding,
    isButtonDisabled,
    streetAddress,
    city,
    zipCode,
    aptBuilding,
    showAddEditView,
    onPlacesAutoCompleteItemPress,
    goToAddAddressView,
    onEditPress,
    handleUserSearch,
    addAddressBtn,
    showStartOrderView,
    showDeliveryAddressView,
    onStartOrderPressed,
    onAddressSelect,
    onEditPressFromStartOrder,
    isMakeAddressDefaultChecked,
    onChangeDefaultAddressCheckbox,
    buttonTitle,
    editAddressBoolean,
    userDataLoading,
    showBottomView,
  } = useDeliveryFlow();

  const {top} = useSafeAreaInsets();

  const renderHeaderView = () => {
    return (
      <View style={styles.header}>
        {showAddEditView || showStartOrderView ? (
          <TouchableOpacity
            accessible
            accessibilityHint={'activate go to previous screen.'}
            onPress={handleClosePress}
            activeOpacity={0.7}
            style={styles.headerIconBackground}>
            <BackImage />
          </TouchableOpacity>
        ) : (
          <View style={styles.nullHeaderIcon} />
        )}
        <RText
          text={'Delivery Address'}
          textStyle={{textTransform: 'uppercase'}}
          size={'lg'}
          weight={'headerBold'}
        />
        <TouchableOpacity
          accessible
          accessibilityHint={'activate go to previous screen.'}
          onPress={handleClosePress}
          activeOpacity={0.7}
          style={styles.headerIconBackground}>
          <ImageComponent source={images.header_cross} style={styles.headerCrossIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddressItem = useCallback(
    ({item}) => {
      const isSelected = selectedAddress && selectedAddress.id === item.id;
      return (
        <TouchableOpacity
          accessible
          accessibilityHint={'activate to select the address for your order delivery.'}
          activeOpacity={0.9}
          onPress={() => onAddressSelect(item)}>
          <DeliveryAddressComponent
            Image={() => (item?.isdefault ? <DefaultAddressIcon /> : <NonDefaultAddressIcon />)}
            titleText={item?.isdefault ? 'Default Address' : ''}
            titleFontSize={'xs'}
            titleWeight={'bold'}
            subTitleSize={'xxs'}
            subTitle={item?.streetaddress + ', ' + item?.city + ', ' + item?.zipcode}
            onEditPress={() => onEditPress(item)}
            containerStyle={[
              {marginVertical: 5, paddingHorizontal: getMScale(5)},
              isSelected && {borderWidth: 2, borderColor: colors.secondary},
            ]}
            isDefault={item?.isdefault}
          />
        </TouchableOpacity>
      );
    },
    [selectedAddress],
  );

  const renderListEmptyComponent = () => {
    if (userDataLoading) {
      return <DeliveryAddressLoading />;
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 250,
            paddingHorizontal: 70,
          }}>
          <EmptyLocationListIcon />
          <RText
            textStyle={{marginTop: 10, textAlign: 'center'}}
            size={'xs'}
            text={'You do not have any saved addresses. You can add new here.'}
          />
        </View>
      );
    }
  };
  const renderSheetExpandedView = () => {
    return (
      <View style={styles.expandedViewParent}>
        {!isSearchActive ? (
          <TouchableOpacity
            accessible
            accessibilityHint={'activate to get your current location'}
            activeOpacity={0.7}
            onPress={onCurrentLocationPress}
            style={styles.currentLocationView}>
            <ImageComponent source={images.current_location} style={styles.currLocationIcon} />
            <RText
              text={'Use Current Location'}
              weight={'semiBold'}
              size={'xs'}
              textStyle={styles.currLocationText}
            />
          </TouchableOpacity>
        ) : null}
        {deliveryAddressesList?.length ? (
          <View style={styles.listHeader}>
            <RText
              size={'sm'}
              color={colors.primary}
              text={'Select a saved address below or add new'}
              weight={'bold'}
            />
          </View>
        ) : null}

        <BottomSheetFlatList
          data={deliveryAddressesList}
          // bounces={false}
          renderItem={renderAddressItem}
          estimatedItemSize={200}
          extraData={selectedAddress}
          ListEmptyComponent={renderListEmptyComponent}
          contentContainerStyle={styles.container}
          keyExtractor={(_, index) => index.toString()}
        />
        {isLoggedIn && showBottomView ? (
          <View style={styles.lowerBtnsWrapper}>
            {deliveryAddressesList?.length !== 0 ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.addNewAdddressBtn}
                  onPress={goToAddAddressView}>
                  <RText
                    text={strings.add_a_new_address}
                    color={colors.secondary}
                    size={'sm'}
                    weight={'bold'}
                  />
                </TouchableOpacity>
                <View style={styles.bottomView}>
                  <RButton
                    onPress={onStartOrderPressed}
                    title={buttonTitle}
                    loading={loading}
                    disabled={restaurantsLoading || loading || !selectedAddress}
                    buttonStyle={styles.deliveryAddressBtn}
                  />
                </View>
              </>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };
  const renderAutoCompleteRow = data => {
    return (
      <View style={{flex: 1}}>
        <RText textStyle={styles.autoCompleteRow} color={colors.primary} size={'xs'}>
          {data.structured_formatting.main_text} {data.structured_formatting.secondary_text}
        </RText>
      </View>
    );
  };

  const renderSearchInput = () => {
    return (
      <View style={styles.searchParent}>
        <GooglePlacesAutocomplete
          ref={googleAutoCompleteRef}
          keepResultsAfterBlur
          value={searchVal}
          autoCorrect={false}
          placeholderTextColor={colors.placeholder}
          returnKeyType={'search'}
          returnKeyLabel={'Search'}
          onSubmitEditing={searchLocations}
          placeholder={'Enter your address'}
          keyboardShouldPersistTaps={'handled'}
          renderRow={rowData => renderAutoCompleteRow(rowData)}
          isRowScrollable={false}
          enablePoweredByContainer={false}
          listUnderlayColor={'red'}
          debounce={500}
          fetchDetails={true}
          textInputProps={{
            onChangeText: handleUserSearch,
            // clearButtonMode: 'never',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
            separator: styles.separator,
          }}
          onPress={onPlacesAutoCompleteItemPress}
          query={{
            key: Config.REACT_APP_GOOGLE_API_KEY,
            location: '37.772,-122.214',
            components: 'country:us',
            radius: '200000', //100 km
            origin: '37.772,-122.214',
          }}
        />
      </View>
    );
  };

  const memoizedMarkers = useMemo(() => {
    const {id = 123} = nearestRestaurantToLocation || {};
    return markers.map((marker, index) => {
      return (
        <Marker
          key={String(index)}
          coordinate={marker.coordinate}
          icon={
            marker.locationId === id
              ? require('../ChooseStoreScreen/largeicon.png')
              : require('../ChooseStoreScreen/smallicon.png')
          }
        />
      );
    });
  }, [markers, nearestRestaurantToLocation]);

  const renderAddEditAddressView = () => {
    return (
      <View style={styles.sheetContentContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.inputsView}>
            <InputField
              placeholder={strings.street_address_}
              value={streetAddress}
              onChangeText={handleStreetAddress}
              blurOnSubmit={false}
              label={strings.street_address_}
              onSubmitEditing={() => ref_aptBuiilding.current?.focus()}
              keyboardType={constants.KEYBOARD_TYPES.DEFAULT}
            />
            <InputField
              ref={ref_aptBuiilding}
              placeholder={strings.aptFloor_optional}
              value={aptBuilding}
              onChangeText={handleAptBuilding}
              blurOnSubmit={false}
              label={strings.aptFloor_optional}
              onSubmitEditing={() => ref_city.current?.focus()}
              keyboardType={constants.KEYBOARD_TYPES.DEFAULT}
            />
            <InputField
              ref={ref_city}
              placeholder={strings.city}
              value={city}
              onChangeText={handleCity}
              blurOnSubmit={false}
              label={strings.city}
              onSubmitEditing={() => ref_zipCode.current?.focus()}
              keyboardType={constants.KEYBOARD_TYPES.DEFAULT}
            />
            <InputField
              ref={ref_zipCode}
              placeholder={strings.zipCode}
              value={zipCode}
              maxLength={5}
              onChangeText={handleZipCode}
              blurOnSubmit={false}
              label={strings.zipCode}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType={'done'}
              keyboardType={constants.KEYBOARD_TYPES.NUMERIC}
            />
            {isLoggedIn ? (
              <TouchableOpacity
                accessible
                accessibilityHint={'activate to make this address as default'}
                activeOpacity={0.7}
                onPress={() => onChangeDefaultAddressCheckbox(!isMakeAddressDefaultChecked)}
                style={styles.makeDefaultAddressParent}>
                <View style={styles.makeDefaultAddressInnerView}>
                  <DefaultAdddressSmallIcon />
                  <RText
                    text={strings.make_default_delivery_address}
                    color={colors.primary}
                    size={'xxs'}
                    weight={'semiBold'}
                    textStyle={styles.makeAddressDefaultTextStyle}
                  />
                </View>
                <CheckBox
                  height={20}
                  width={20}
                  checked={isMakeAddressDefaultChecked}
                  onValueChange={onChangeDefaultAddressCheckbox}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        <KeyboardAvoidingView
          style={{flex: 1, width: SCREEN_WIDTH}}
          behavior={isIos ? 'padding' : 'height'}>
          <View style={styles.saveButtonContainer}>
            <RButton
              accessibilityHint={'activate to add this address.'}
              onPress={addAddressBtn}
              disabled={isButtonDisabled}
              title={editAddressBoolean ? strings.update_address : strings.add_address}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };
  const renderStartOrderView = () => {
    return (
      <View style={{flex: 1, paddingHorizontal: getMScale(16), paddingTop: getMScale(24)}}>
        <DeliveryAddressComponent
          Image={() => <DefaultAddressIcon />}
          titleText={''}
          titleFontSize={'xs'}
          titleWeight={'bold'}
          subTitleSize={'xxs'}
          subTitle={
            streetAddress + ', ' + (aptBuilding ? aptBuilding + ', ' : '') + city + ', ' + zipCode
          }
          onEditPress={onEditPressFromStartOrder}
          containerStyle={{marginVertical: 5, paddingHorizontal: getMScale(5)}}
          isDefault={false}
        />
        <View style={styles.bottomView}>
          <RButton
            accessibilityHint={'activate to start your order.'}
            onPress={onStartOrderPressed}
            title={buttonTitle}
            loading={restaurantsLoading || loading}
            disabled={!selectedAddress || restaurantsLoading || loading}
            buttonStyle={{width: '80%'}}
            // buttonStyle={styles.deliveryAddressBtn}
          />
        </View>
      </View>
    );
  };
  const renderBottomSheet = () => {
    return (
      <GestureHandlerRootView style={styles.bottomSheetContainer}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          topInset={top}
          snapPoints={
            showDeliveryAddressView && !isSearchActive
              ? snapPoints1
              : showDeliveryAddressView && isSearchActive
              ? snapPoints2
              : showAddEditView
              ? snapPoints2
              : snapPoints3
          }
          handleComponent={null}
          animationDuration={300}
          keyboardBehavior={KEYBOARD_BEHAVIOR.extend}
          style={styles.sheetStyle}
          onChange={handleSheetChanges}>
          <View style={styles.sheetContentContainer}>
            {renderHeaderView()}
            {!showAddEditView &&
            !showStartOrderView &&
            (deliveryAddressesList === undefined || deliveryAddressesList?.length === 0)
              ? renderSearchInput()
              : null}
            {showDeliveryAddressView && renderSheetExpandedView()}
            {showAddEditView && renderAddEditAddressView()}
            {showStartOrderView && renderStartOrderView()}
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        cacheEnabled={false}
        loadingIndicatorColor={colors.primary}
        onMapLoaded={e => {}}
        style={styles.map}
        minZoomLevel={2}
        showsUserLocation
        zoomControlEnabled={false}
        camera={mCamera}>
        {memoizedMarkers}
      </MapView>
      {/*<LoadingOverlay isLoading={restaurantsLoading || loading} />*/}
      {renderBottomSheet()}
    </View>
  );
};
export default DeliveryFlow;
