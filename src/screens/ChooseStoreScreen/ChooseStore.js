import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {colors} from '../../theme';
import useChooseStore from './useChooseStore';
import styles from './styles';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AccessibilityInfo, Alert, findNodeHandle, KeyboardAvoidingView, TouchableOpacity, View} from 'react-native';
import {images} from '../../assets';
import BottomSheet, {
    BottomSheetTextInput,
    BottomSheetFlatList,
    KEYBOARD_BEHAVIOR, KEYBOARD_BLUR_BEHAVIOR,
} from '@gorhom/bottom-sheet';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import RText from '../../components/RText';
import {formatDateTime} from '../../utils/timeUtils';
import {constants, strings} from '../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import EmptyLocationListIcon from '../../assets/svgs/EmptyLocationListIcon';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {formatLocationName, isIos} from '../../utils/sharedUtils';
import RButton from '../../components/RButton';
import BottomSheetHeader from '../../components/BottomSheetHeader/BottomSheetHeader';
import StoresListLoading from './RestaurantsListPlaceholder';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";

const ChooseStore = ({onSelectItem, onClose, selectedOrderType, isLoading}) => {
    const {
        markers,
        searchVal,
        setSearchVal,
        bottomSheetRef,
        handleSheetChanges,
        snapPoints,
        filteredLocations,
        isSearchActive,
        restaurantsLoading,
        availableRestaurants,
        isLocationAllowed,
        mapRef,
        handleSelectLocationItem,
        searchLocationDebounce,
        onCurrentLocationPress,
        nearestRestaurantToLocation,
        handleClosePress,
        searchLoading,
        closeSearch,
        selectedLocation,
        onSaveStorePress,
        transferredBasketLoading,
        fetchingAndSettingFavLocation,
        loading,
        onPressMarker,
        flatListRef,
    } = useChooseStore({onSelectItem, onClose, selectedOrderType});

    const {isAccessibilityOn} = useUserSelector();

    const bottomSheetViewRefForAccessibility = useRef();

    useEffect(() => {
        if (isAccessibilityOn) {
            const reactTag = findNodeHandle(bottomSheetViewRefForAccessibility.current);
            if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
            }
        }
    }, [isAccessibilityOn]);

    const {top, bottom} = useSafeAreaInsets();

    const renderItem = useCallback(
        ({item}) => {
            const {id, name, streetaddress, city, distance, calendars = []} = item || {};
            const {ranges = []} = calendars?.[0] || [];
            const {end = ''} = ranges?.[0] || {};
            const formattedName = formatLocationName(name);
            const isSelected = id === selectedLocation?.id || false;
            return (
                <TouchableOpacity
                    accessible
                    accessibilityLabel={`${formattedName}\n${streetaddress}, ${city}`}
                    accessibilityHint={'activate to select location.'}
                    key={name}
                    activeOpacity={1}
                    onPress={() => handleSelectLocationItem(item)}
                    style={[
                        styles.locationItemParent,
                        isSelected && {borderWidth: 2, borderColor: colors.secondary},
                    ]}>
                    <ImageComponent source={images.selected_loc} style={{width: 50, height: 50}} />
                    <View style={styles.locationInfoView}>
                        <RText
                            text={formattedName}
                            textStyle={styles.locationName}
                            size={'xs'}
                            weight={'semiBold'}
                        />
                        <View>
                            <RText
                                textStyle={{marginTop: 5}}
                                size={'xs'}
                                color={colors.primary}
                                text={`${streetaddress}, ${city}`}
                            />
                            {calendars?.length > 0 ? (
                                <RText
                                    text={`${distance} mi • Open until ${formatDateTime(
                                        end,
                                        'h:mm A',
                                        constants.TIME_FORMAT.YYYYMMDD_HH_mm,
                                    )}`}
                                    size={'xs'}
                                    color={colors.subTitleText}
                                    textStyle={{marginTop: 5}}
                                />
                            ) : null}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        },
        [selectedLocation],
    );

    const renderListHeader = () => {
        if (isLocationAllowed || isSearchActive) {
            return (
                <View accessible style={styles.listHeader}>
                    <RText
                        size={'sm'}
                        text={
                            isSearchActive ? `Nearby "${searchVal}"` : isLocationAllowed ? 'Nearby Store' : ''
                        }
                        weight={'bold'}
                    />
                </View>
            );
        }
        return null;
    };

    const renderListEmptyComponent = () => {
        if (restaurantsLoading || searchLoading) {
            return <StoresListLoading />;
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
                        text={'We are sorry, there is no nearby store in this location'}
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
                        accessibilityHint={'activate to select your current location.'}
                        activeOpacity={0.7}
                        onPress={onCurrentLocationPress}
                        style={styles.currentLocationView}>
                        <ImageComponent source={images.current_location} style={styles.currLocationIcon} />
                        <RText
                            text={'Current Location'}
                            weight={'semiBold'}
                            size={'xs'}
                            textStyle={styles.currLocationText}
                        />
                    </TouchableOpacity>
                ) : null}
                <BottomSheetFlatList
                    ref={flatListRef}
                    data={isSearchActive ? filteredLocations : availableRestaurants}
                    ListHeaderComponent={renderListHeader}
                    renderItem={renderItem}
                    ListEmptyComponent={renderListEmptyComponent}
                    contentContainerStyle={{
                        paddingHorizontal: 15,
                        paddingBottom: getVerticalScale(bottom + 30),
                    }}
                    onScrollToIndexFailed={error=> {
                        flatListRef?.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                        setTimeout(() => {
                            flatListRef?.current?.scrollToIndex({ index: error.index, animated: true });
                        }, 100);
                    }}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    };

    const renderSearchInput = () => {
        return (
            <View style={styles.searchParent}>
                <ImageComponent source={images.search} style={styles.searchIcon} />
                <View style={styles.inputView} />
                <BottomSheetTextInput
                    accessibilityRole={'search'}
                    value={searchVal}
                    style={styles.input}
                    autoCorrect={false}
                    placeholderTextColor={colors.placeholder}
                    onChangeText={text => {
                        setSearchVal(text);
                        searchLocationDebounce(text);
                    }}
                    returnKeyType={'search'}
                    allowFontScaling={isIos}
                    maxFontSizeMultiplier={isIos ? 1.3 : 1}
                    returnKeyLabel={'Search'}
                    // onSubmitEditing={searchLocations}
                    placeholder={strings.search_placeholder}
                />
                <TouchableOpacity
                    accessible
                    accessibilityLabel={'clear'}
                    accessibilityRole={'button'}
                    accessibilityHint={'activate to clear search input'}
                    onPress={closeSearch}>
                    <ImageComponent source={images.cross} style={styles.crossIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    const memoizedMarkers = useMemo(() => {
        const {id = ''} = selectedLocation || nearestRestaurantToLocation || {};
        return markers.map((marker, index) => {
            const {locationId = ''} = marker || {};
            return (
                <Marker
                    key={String(locationId)}
                    identifier={String(locationId)}
                    coordinate={marker.coordinate}
                    onPress={() => onPressMarker(marker, index)}
                    icon={marker.locationId === id ? require('./largeicon.png') : require('./smallicon.png')}
                />
            );
        });
    }, [markers, nearestRestaurantToLocation, selectedLocation]);

    const renderBottomSheet = () => {
        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                topInset={top}
                snapPoints={snapPoints}
                handleComponent={null}
                animationDuration={300}
                keyboardBehavior={KEYBOARD_BEHAVIOR.fillParent}
                keyboardBlurBehavior={KEYBOARD_BLUR_BEHAVIOR.restore}
                style={styles.sheetStyle}
                onChange={handleSheetChanges}>
                <View ref={bottomSheetViewRefForAccessibility}  style={styles.sheetContentContainer}>
                    <BottomSheetHeader
                        title={strings.select_your_store}
                        onClose={handleClosePress}
                        loading={searchLoading}
                    />
                    {renderSearchInput()}
                    {renderSheetExpandedView()}
                    <KeyboardAvoidingView
                        style={{flex: 1, width: SCREEN_WIDTH}}
                        behavior={isIos ? 'padding' : 'height'}>
                        <View style={styles.saveButtonContainer}>
                            <RButton
                                accessibilityHint={'activate to save store.'}
                                onPress={onSaveStorePress}
                                disabled={
                                    !selectedLocation ||
                                    searchLoading ||
                                    isLoading ||
                                    transferredBasketLoading ||
                                    fetchingAndSettingFavLocation ||
                                    loading
                                }
                                title={'Select Store'}
                                loading={
                                    isLoading || transferredBasketLoading || fetchingAndSettingFavLocation || loading
                                }
                            />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </BottomSheet>
        );
    };

    return (
        //To interact with bottom sheet in android, wrapping a GestureHandlerRootView is a must.
        <GestureHandlerRootView style={styles.parent}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                userInterfaceStyle={'light'}
                style={{height: '85%'}}
                loadingEnabled
                moveOnMarkerPress
                accessibilityElementsHidden    //Google map should not focus by voice over
                minZoomLevel={7}
                showsUserLocation
            >
                {memoizedMarkers}
            </MapView>
            {renderBottomSheet()}
        </GestureHandlerRootView>
    );
};
export default ChooseStore;
