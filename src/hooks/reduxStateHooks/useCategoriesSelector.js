import {useSelector} from 'react-redux';

const useCategoriesSelector = () => {
  const {categories: mCategories = {}, productImages = {}} = useSelector(state => state.category);
  const {categories, imagepath, singleusecategories} = mCategories || {};
  return {
    categories,
    imagepath,
    singleusecategories,
    productImages,
  };
};

export default useCategoriesSelector;
