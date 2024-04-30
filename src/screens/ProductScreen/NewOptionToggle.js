import {Switch, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import HorizontalLine from './HorizontalLine';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {getMScale} from '../../theme/metrics';
import RText from '../../components/RText';
import {colors} from '../../theme';
import EditPencilIcon from '../../assets/svgs/EditPencilIcon';
import NewOptionsGroup from './NewOptionsGroup';
import {setExpandedModifiers} from '../../redux/actions/product/option';
import {logToConsole} from "../../configs";

const NewOptionToggle = ({onSelectOption, modifier,showDrinksModal,isToggleModifier,isFirstLevel}) => {
  const {id: modifierId, options, parentName} = modifier || {};


  const selections = useSelector(state => state.productSelections);
  const {expandedModifiers} = useSelector(state => state.productOptions);

  const isCustomizeExpanded = useMemo(() => !!expandedModifiers[modifierId], [expandedModifiers]);

  const isEnabledToggle = useMemo(() => {
    return selections[modifierId]?.selected[0]?.optionIndex === 1;
  }, [modifierId, selections]);

  useEffect(() => {
    global.isCustomized = isEnabledToggle;
  }, [isEnabledToggle]);

  const onValueChange = isChecked => {
    const optionIndex = isChecked ? 1 : 0;
    onSelectOption({option: options[optionIndex], optionIndex, modifier});
  };

  const modifierName = useMemo(() => {
    const arrString = parentName?.trim()?.split(' ');
    return arrString?.slice(arrString.length - 2, arrString?.length).join(' ');
  }, [parentName]);

  const dispatch = useDispatch();
  useEffect(() => {
    onValueChange(true);
    dispatch(
      setExpandedModifiers({
        [modifierId]: false,
      }),
    );
  }, [modifier]);

  const customizationString = useMemo(() => {
    const customizedModifiers = modifier.options[1].modifiers;
    let stringVal = '';
    customizedModifiers?.forEach(cm => {
      const {id, description} = cm ?? {};
      const allSelectedNames = selections?.[id]?.selected?.map((item, index) => {
        let name = item?.name ?? '';
        const innerModifier = cm.options[index].modifiers?.[0];
        if (innerModifier) {
          const innerName = selections?.[innerModifier.id]?.selected?.map(i => i.name);
          if (innerName?.length > 0) {
            name = `${name} (${innerName.join(', ')})`;
          }
        }
        return name;
      });
      const selected = allSelectedNames?.length > 0 ? allSelectedNames?.join(', ') : 'None';
      stringVal = stringVal + `${description}: ${selected}\n`;
    });
    return stringVal;
  }, [selections, modifier]);

  const onAccessibilityValueChanged = useCallback(() => {
    onValueChange(!isEnabledToggle);
  }, [isEnabledToggle]);

  const onPressEditButton = () => {
    dispatch(setExpandedModifiers({[modifierId]: true}));
  };


  useEffect(() => {

    const option = modifier.options.find(option => option.name === "As is");
    if (option && option.isdefault === false) {

      dispatch(setExpandedModifiers({ [modifierId]: true }));
    }

  }, []);



  // const itemImageUri = useMemo(() => {
  //   if (['no rice', 'no beans', 'no protein', 'no salsa'].includes(name.toLowerCase())) {
  //     return images.no_ingredients;
  //   }
  //   if (name.toLowerCase() === 'as is' || name.toLowerCase() === 'customize') {
  //     return {uri: global.modifierImage};
  //   }
  //   if (checkTacoMatch(name, isdefault)) {
  //     return {uri: global.modifierImage};
  //   }
  //   return {uri: itemImage};
  // }, [isdefault, itemImage, name]);

  /*New Design that replaces Customize Switch,
   * returns New design when edit button is pressed i.e. isCustomizedExpanded true or false OR
   * returns OptionGroup for Customize section to render with additional props that controls the specific flow OR
   * returns Old switch UI when new design does not require*/
  const renderNewDesignModifier = () => {
    // if (supportsNewDesign) {
    return (
      <>
        <RText
          text={`Customize ${modifierName ?? 'Taco'}`}
          textStyle={{marginVertical: 6, marginStart: 5}}
          size={'xxs'}
          weight={'semiBold'}
        />
        <>
          {isCustomizeExpanded ? (
            <NewOptionsGroup
              isProtein={false}
              modifier={modifier}
              isCustomizeExpanded={isCustomizeExpanded}
              withNewDesign={true}
              showDrinksModal={showDrinksModal}
            />
          ) : (
            <View
              accessible
              accessibilityRole={'switch'}
              onAccessibilityTap={onAccessibilityValueChanged}
              style={[styles.customizeItem, styles.customizeItemNewDesign]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: getMScale(65),
                    width: getMScale(65),
                    borderRadius: getMScale(50),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.white,
                    shadowColor: colors.black,
                    shadowOffset: {
                      width: 1,
                      height: 1,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 0.1,
                    elevation: 3,
                  }}>
                  <ImageComponent
                    source={{uri: global.itemImage}}
                    resizeMode={'cover'}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: getMScale(50),
                    }}
                  />
                </View>
                <RText
                  text={customizationString}
                  numberOfLines={6}
                  size={'xxs'}
                  textStyle={{marginStart: 20, width: '70%'}}
                />
              </View>
              <TouchableOpacity onPress={onPressEditButton}>
                <EditPencilIcon />
              </TouchableOpacity>
            </View>
          )}
        </>
        <HorizontalLine style={{marginTop: 8, marginBottom: 16}} />
      </>
    );
    // }
    // return (
    //   <>
    //     <View
    //       accessible
    //       accessibilityRole={'switch'}
    //       onAccessibilityTap={onAccessibilityValueChanged}
    //       style={styles.customizeItem}>
    //       <RText
    //         accessible
    //         text={'Customize'}
    //         size={'xxs'}
    //         weight={'semiBold'}
    //         textStyle={styles.toggleText}
    //       />
    //       <Switch
    //         trackColor={{false: colors.secondaryLight, true: colors.primary}}
    //         thumbColor={colors.secondary}
    //         ios_backgroundColor={colors.white}
    //         value={isEnabledToggle}
    //         onValueChange={onValueChange}
    //       />
    //     </View>
    //     <HorizontalLine style={{marginTop: 8, marginBottom: 16}} />
    //   </>
    // );
  };
  return <>{renderNewDesignModifier()}</>;
};
export default NewOptionToggle;
