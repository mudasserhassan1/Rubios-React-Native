import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {logToConsole} from "../../configs";

const useMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {category: cat} = route?.params || {};
  const {description} = cat || {};

  const [category, setCategory] = useState(cat);
  const [products, setProducts] = useState([]);
  const {mCategories, mLoading} = useSelector(
    ({category: {loading: mLoading, categories: mCategories}}) => ({
      mLoading,
      mCategories,
    }),
  );

  const {id} = category || {};
  const {categories = []} = mCategories || {};

  useFocusEffect(
    useCallback(() => {
      const filteredCategory = categories?.filter(item => item.id === id)[0];
      if (filteredCategory) {
        setCategory(filteredCategory);
        setProducts(filteredCategory?.products || []);
      } else {
        navigation.goBack();
      }
    }, [categories]),
  );

  useEffect(() => {
    navigation.setParams({
      title: cat?.name?.toUpperCase() || '',
      largeTitle: true,
    });
  }, [category, navigation]);

  const {imagepath = ''} = mCategories || {};
  return {
    mLoading,
    mCategories,
    products,
    imagepath,
    description,
    cat,
  };
};

export default useMenu;
