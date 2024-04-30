import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import styles from './styles';
import RText from '../../components/RText';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import Divider from '../../components/Divider';
import {getlocations} from '../../redux/actions/location';

const LocationsModal = ({isVisible, onClose, onItemClick}) => {
  const {locations: favLocations = {}} = useSelector(({location: {locations} = {}}) => ({
    locations,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getlocations());
  }, [dispatch]);

  function _keyExtractor(item) {
    const {location_id} = item || {};
    return location_id;
  }

  const renderItem = ({item}) => {
    const {location_id = ''} = item || {};
    return (
      <TouchableWithoutFeedback onPress={() => onItemClick(item)} key={location_id}>
        <View style={styles.locationItemContainer}>
          <RText
            key={location_id}
            text={item.name}
            style={styles.locationText}
            weight={'bold'}
            size={20}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <ModalComponent isVisible={isVisible} onRequestClose={onClose}>
      <SafeAreaView>
        {favLocations ? (
          <FlatList
            style={styles.listStyle}
            data={favLocations}
            keyExtractor={_keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
          />
        ) : (
          <ActivityIndicator size="large" hidesWhenStopped={true} />
        )}
      </SafeAreaView>
    </ModalComponent>
  );
};

export default React.memo(LocationsModal);
