import RText from '../../components/RText';
import React, {useRef, useState} from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import useRestaurantsListSelector from '../../hooks/reduxStateHooks/useRestaurantsListSelector';
import {colors} from '../../theme';
import {formatLocationName} from '../../utils/sharedUtils';
import {getMScale} from '../../theme/metrics';
import {getSingleLocation} from '../../redux/actions/location';
import {useDispatch} from 'react-redux';
import {screens} from '../../constants';
import SpinnerOverly from '../LoadingComponent/SpinnerOverly';
import {BottomSheetFlatList, BottomSheetTextInput} from '@gorhom/bottom-sheet';

const RewardsCodeBottomSheet = ({closeBottomSheet}) => {
  const {restaurantsList} = useRestaurantsListSelector();
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(restaurantsList?.restaurants);
  const dispatch = useDispatch();

  const ref = useRef();

  const renderHeaderView = () => {
    return (
      <View style={styles.timeSlotHeader}>
        <View style={styles.nullHeaderIcon} />
        <RText
          text={'Select Restaurant'}
          textStyle={{textTransform: 'uppercase'}}
          size={'lg'}
          weight={'headerBold'}
        />
        <TouchableOpacity
          onPress={closeBottomSheet}
          activeOpacity={0.7}
          style={styles.headerIconBackground}>
          <ImageComponent source={images.header_cross} style={styles.headerCrossIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const callBack = status => {
    if (status === 'success') {
      setLoading(false);
      closeBottomSheet();
      navigation.navigate(screens.SCAN_RECIEPT);
    } else {
      setLoading(false);
    }
  };
  const selectLocation = item => {
    setLoading(true);
    setSelectedLocation(item);
    dispatch(getSingleLocation(item.extref, callBack));
  };
  const ItemView = ({item}) => {
    const {id, name, streetaddress, city} = item || {};
    const formattedName = formatLocationName(name);
    const isSelected = id === selectedLocation?.id || false;
    return (
      <TouchableOpacity
        key={name}
        activeOpacity={1}
        onPress={() => selectLocation(item)}
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
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = text => {
    setSearchText(text);
    const filteredItems = restaurantsList?.restaurants.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filteredItems);
  };
  const renderRestaurantList = () => {
    return (
      <View>
        {renderSearchInput()}
        <BottomSheetFlatList
          ref={ref}
          data={filteredData}
          renderItem={ItemView}
          style={{paddingTop: getMScale(10)}}
          contentContainerStyle={{marginHorizontal: getMScale(12)}}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const onCrosstap = () => {
    setSearchText('');
    setFilteredData(restaurantsList?.restaurants);
  };

  const renderSearchInput = () => {
    return (
      <View style={styles.searchParent}>
        <ImageComponent source={images.search} style={styles.searchIcon} />
        <View style={styles.inputView} />
        <BottomSheetTextInput
          value={searchText}
          style={styles.input}
          autoCorrect={false}
          placeholderTextColor={colors.placeholder}
          onChangeText={handleSearch}
          returnKeyType={'search'}
          returnKeyLabel={'Search'}
          onSubmitEditing={handleSearch}
          placeholder={'Search'}
        />
        <TouchableOpacity onPress={onCrosstap}>
          <ImageComponent source={images.cross} style={styles.crossIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {renderHeaderView()}
      {renderRestaurantList()}
      <SpinnerOverly isLoading={loading} />
    </View>
  );
};

export default RewardsCodeBottomSheet;
