import useMenuCategories from './useMenuCategories';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import RText from '../../components/RText';
import {colors} from '../../theme';
import {getMScale, SCREEN_WIDTH} from '../../theme/metrics';
import React from 'react';
import {changeImageSize} from '../../helpers/common';
import CategoriesPlaceholder from './CategoriesPlaceholder';
import {isIos} from '../../utils/sharedUtils';

const Categories = () => {
  const {mCategories, onCategoryPress, mLoading} = useMenuCategories();
  const renderCategories = ({item}) => {
    const {name} = item || {};
    const {products = [], imagefilename} = item || {};
    const {images} = products[0];

    const imageFile =
      mCategories?.imagepath + changeImageSize(imagefilename, images, 'marketplace-product') || '';
    return (
      <TouchableOpacity
        accessible
        accessibilityHint={`activate to select ${name} as a category`}
        activeOpacity={0.7}
        onPress={() => onCategoryPress(item)}
        style={styles.parentView}>
        <View
          style={styles.imageAndNameView}>
          <View
            style={styles.imageView}>
            <ImageComponent
              source={
                mCategories.imagepath
                  ? {uri: imageFile}
                  : require('../../assets/images/default_item_image.png')
              }
              resizeMode={mCategories.imagepath ? 'cover' : 'contain'}
              style={styles.image}
            />
          </View>
          <RText
            text={name}
            weight={'headerBold'}
            numberOfLines={2}
            ellipsizeMode={'tail'}
            textStyle={styles.nameText}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor: colors.white, width: SCREEN_WIDTH}}>
      {mLoading ? (
        <View style={{marginTop: getMScale(10)}}>
          <CategoriesPlaceholder />
        </View>
      ) : (
        <FlatList
          data={mCategories?.categories}
          keyExtractor={item => item.id}
          renderItem={renderCategories}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: getMScale(40), paddingHorizontal: getMScale(16)}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    parentView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: getMScale(12),
        justifyContent: 'space-between',
        width: isIos ? '95%' : '90%',
    },
    imageAndNameView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageView: {
        width: getMScale(55),
        height: getMScale(55),
        borderRadius: getMScale(5),
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: getMScale(5),
    },
    nameText: {marginStart: getMScale(24), maxWidth: '80%', textTransform: 'uppercase'},
})
export default Categories;
