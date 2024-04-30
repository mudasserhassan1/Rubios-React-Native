import {FlatList, View} from 'react-native';
import React, {useState} from 'react';
import {screens, strings} from '../../constants';
import useMenu from './useMenu';
import MenuItem from '../../components/MenuItem';
import {colors} from '../../theme';
import {navigateTo} from '../../utils/navigationUtils';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import MenuScreenHeader from '../../components/MenuScreenHeader/MenuScreenHeader';
import useQuickAddToBag from '../../hooks/useQuickAdd';
import useCategoriesSelector from '../../hooks/reduxStateHooks/useCategoriesSelector';
import RText from '../../components/RText';
import {logToConsole} from "../../configs";

const MenuScreen = ({route}) => {
  const {products, description, cat} = useMenu();
  const [selectedItem, setSelectedItem] = useState(null);

  const {fetchingModifiersAndAddToBag, onQuickAddPress, renderChooseProteinsBottomSheet} =
    useQuickAddToBag({
      productId: selectedItem?.id,
      product: selectedItem,
    });
  const {productImages = {}} = useCategoriesSelector();
  const navigateToProductScreen = item => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'customise',
      click_destination: screens.PRODUCT,
    });
    logFirebaseCustomEvent(strings.select_item, {
      item_list_id: route?.params?.category?.id,
      item_list_name: route?.params?.category?.name,
      items: [{price: item?.cost, item_id: item?.id, item_name: item?.name}],
    });
    navigateTo(screens.PRODUCT, {
      productId: item?.id,
      productPrice: item?.cost,
      productName: item?.name,
      shortDescription: item?.shortdescription,
      categoryId: cat?.id,
      categoryName: cat?.name,
      metaData: route?.params?.metaData,
    });
  };
  const renderMenuItem = ({item}) => {
    return (
      <MenuItem
        onPress={() => navigateToProductScreen(item)}
        item={item}
        imagePath={productImages?.[item?.id]}
        onQuickAddPress={async () => {
          setSelectedItem(item);
          await onQuickAddPress(item);
        }}
        loading={selectedItem?.id === item.id && fetchingModifiersAndAddToBag}
      />
    );
  };

  const renderListHeader = () => {
    if (description) {
      return (
        <View
          style={{
            paddingHorizontal: getMScale(27),
            marginBottom: getVerticalScale(14),
            marginTop: getVerticalScale(24),
          }}>
          <RText text={description} weight={'bold'} />
        </View>
      );
    }
    return null;
  };
  return (
    <>
      <MenuScreenHeader showDivider={true} showCartIcon route={route} />
      <View
        pointerEvents={fetchingModifiersAndAddToBag ? 'none' : 'auto'}
        style={{backgroundColor: colors.white, flex: 1}}>
        <FlatList
          data={products}
          listKey="products"
          keyExtractor={item => item.id}
          renderItem={renderMenuItem}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{paddingBottom: getVerticalScale(250)}}
          style={{flex: 1}}
        />
      </View>
      {renderChooseProteinsBottomSheet()}
    </>
  );
};

export default MenuScreen;
