import {useDispatch, useSelector} from 'react-redux';
import React, {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import styles from './styles';

import NewOptionItem from './NewOptionItem';
import NewOptionsMapper from './NewOptionsMapper';
import RText from '../../components/RText';
import {defaultSelect, selectOption} from '../../redux/actions/product/selections';
import NewOptionToggle from './NewOptionToggle';
import HorizontalLine from './HorizontalLine';
import CheckBox from '../../components/CheckBox/CheckBox';
import {colors} from '../../theme';
import ArrowDown from '../../assets/svgs/ArrowDown';
import {
  resetCheckedModifiers,
  setCheckedModifier,
  setExpandedModifiers,
} from '../../redux/actions/product/option';
import {
  defaultModifiersSetters,
  getDefaultModifiers,
  priceCalculator,
} from '../../utils/productUtils';
import {getMScale} from '../../theme/metrics';
import {setSelectingSameOptions} from '../../redux/actions/basket/create';
import {log} from '@react-native-firebase/crashlytics/lib/modular';
import SalsaBarSheet from '../CartScreen/SalsaBarSheet';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RButton from '../../components/RButton';
import {strings} from '../../constants';
import AccessibilityWrapper from '../../components/AccessibilityWrapper/AccessibilityWrapper';
import {isIos} from '../../utils/sharedUtils';
import {logToConsole} from "../../configs";

const NewOptionsGroup = ({
  modifier,
  isProtein,
  customOptionSelectionHandler,
  isCustomizeExpanded = false,
  withNewDesign,
  isLastModifier,
  isEditingProduct = false,
  showDrinksModal,
}) => {
  const checkedModifiers = useSelector(state => state.productOptions.checkedModifiers);
  const [disable, setDisable] = useState(true);
  const {top} = useSafeAreaInsets();
  let popup = modifier?.options?.find(
    opt => opt.metadata?.[0]?.key === 'navigation-style' && opt.metadata?.[0]?.value === 'popup',
  );

  const {
    id: modifierId,
    description,
    options,
    isToggleModifier,
    isFirstLevel,
    parentName,
    sameAsArray = [],
  } = modifier || {};

  const [sameAsChecked, setSameAsChecked] = useState(sameAsArray?.map(_ => false) ?? []);

  const {selectingSameOptions} = useSelector(state => state.basket);

  const selections = useSelector(state => state?.productSelections);
  const allModifiers = useSelector(state => state.productOptions?.options?.optiongroups);

  const selectedOptions = useMemo(
    () => selections?.[modifierId]?.selected || [],
    [modifierId, selections],
  );
  const dispatch = useDispatch();

  const onSelectOption = useCallback(
    ({option: {id: optionId, name: optionName} = {}, modifier, optionIndex} = {}) => {
      const {options: _, ...rest} = modifier;
      if (typeof customOptionSelectionHandler === 'function') {
        customOptionSelectionHandler?.({
          modifier: rest,
          optionIndex,
          option: {optionId, name: optionName},
        });
      } else {
        dispatch(selectOption({modifier: rest, optionIndex, option: {optionId, name: optionName}}));
      }
    },
    [dispatch],
  );

  const isTaco = useMemo(() => description?.toLowerCase()?.includes('taco'), [description]);

  const onResetProteinsChanges = () => {
    if (isEditingProduct) {
      global.selections = {};
      defaultModifiersSetters({
        modifiers: allModifiers,
        isEditingProduct: false,
        isFirstLevel: true,
      });
    }
    dispatch(defaultSelect(global.selections));
  };

  const handleSameTacoUnselection = itemObj => {
    Object.keys(checkedModifiers).forEach(key => {
      const valueObj = checkedModifiers[key];
      if (valueObj[modifier.parentId]) {
        delete checkedModifiers[key];
      }
    });
    delete checkedModifiers[modifier?.parentId];
    dispatch(resetCheckedModifiers({...checkedModifiers}));
    onSelectOption?.(itemObj);
  };

  const isOptionSelectedForModifier = useCallback(
    modifier => {
      const {options: modifierOption = []} = modifier ?? {};
      const optionIds = modifierOption.map(opt => opt.id);
      return selectedOptions.some(so => optionIds.includes(so?.optionId));
    },
    [selectedOptions],
  );

  const isNewDesignModifier = withNewDesign;


  const value = isOptionSelectedForModifier(modifier);

  const {optionsJSX, modifierJSX} = useMemo(() => {
    //UI to render Single Option after selection for new design
    let [optionsUI, modifiersUI] = [[], []];
    if (
      modifier.type === 'optionsWithCustomization' &&
      // isNewDesignModifier &&
      isOptionSelectedForModifier(modifier)
      // !description.toLowerCase().includes('protein')
    ) {
      const indexOf = options.map(opt => opt.id).indexOf(selectedOptions[0].optionId); //find selected option for modifier
      const optionItem = options[indexOf];
      const {modifiers, id: optionId, isDropDownItem, name} = optionItem ?? {};
      const popup = modifier?.options?.find(
        opt =>
          opt.metadata?.[0]?.key === 'navigation-style' && opt.metadata?.[0]?.value === 'popup',
      );
      const isSelected = selectedOptions?.find?.(so => so?.optionId === optionId);
      if (optionsUI.length > 0) {
        optionsUI = optionsUI.slice(indexOf, indexOf);
      } else {
        if (!isToggleModifier) {
          //push selected option into separate instance of OptionsUI array
          optionsUI.push(
            <NewOptionItem
              isProtein={isProtein}
              optionIndex={indexOf}
              isSelected={true}
              option={optionItem}
              modifier={modifier}
              isNewDesign={withNewDesign}
              key={String(optionId)}
              onSelectOption={handleSameTacoUnselection}
              isLastOption={indexOf !== options?.length - 1}
              innerModifiers={isDropDownItem ? modifiers : []}
              popupModifiers={popup ? modifiers : null}
              showDrinksModal={showDrinksModal}
            />,
          );
        }
      }
      const isCustomizeNewDesign = name === 'Customize';
      if (isSelected && !isDropDownItem && !isProtein && !popup) {
        if (isCustomizeNewDesign && !isCustomizeExpanded) {
        } else {
          modifiersUI.push(
            <NewOptionsMapper
              modifiers={modifiers}
              key={String(optionId)}
              withNewDesign={withNewDesign}
              showDrinksModal={showDrinksModal}
            />,
          );
        }
      }
    } else {
      //Old Implementation
      (options || []).forEach((option, index) => {
        const popup = modifier?.options?.find(
          opt =>
            opt.metadata?.[0]?.key === 'navigation-style' && opt.metadata?.[0]?.value === 'popup',
        );

        const {modifiers, id: optionId, isDropDownItem, name} = option || {};
        const isSelected = selectedOptions?.find?.(so => so?.optionId === optionId);
        if (!isToggleModifier) {
          optionsUI.push(
            <NewOptionItem
              isProtein={isProtein}
              optionIndex={index}
              isSelected={isSelected}
              option={option}
              modifier={modifier}
              isNewDesign={withNewDesign}
              key={String(optionId)}
              onSelectOption={handleSameTacoUnselection}
              isLastOption={index !== options.length - 1}
              innerModifiers={isDropDownItem ? modifiers : []}
              popupModifiers={popup ? modifiers : null}
              isNewDesignModifier={isNewDesignModifier}
              showDrinksModal={showDrinksModal}
            />,
          );
        }
        const isCustomizeNewDesign = name === 'Customize';
        if (isSelected && !isDropDownItem && !isProtein && !popup) {
          if (isCustomizeNewDesign && !isCustomizeExpanded) {
          } else {
            modifiersUI.push(
              <NewOptionsMapper
                modifiers={modifiers}
                key={String(optionId)}
                withNewDesign={withNewDesign}
                showDrinksModal={showDrinksModal}
              />,
            );
          }
        }
      });
    }
    return {optionsJSX: optionsUI, modifierJSX: modifiersUI};
  }, [
    options,
    selectedOptions,
    isToggleModifier,
    isProtein,
    modifier,
    onSelectOption,
    description,
    isCustomizeExpanded,
  ]);

  logToConsole({modifier})


  const renderOptionsHeading = () => {
    if (isToggleModifier && !isCustomizeExpanded) {
      //do not repeat Customize Card if Edit button is pressed
      return (
        <View style={{backgroundColor: 'white'}}>
          <HorizontalLine style={{marginBottom: 8}} />
          <NewOptionToggle isFirstLevel={isFirstLevel} isToggleModifier={isToggleModifier} onSelectOption={onSelectOption} modifier={modifier} showDrinksModal={ showDrinksModal}/>
        </View>
      );
    }
    if (
      (isFirstLevel || (withNewDesign && parentName.toLowerCase().includes('protein'))) &&
      !isToggleModifier
    ) {
      return (
        <>
          <View style={[styles.optionHeadingView, {width: '100%'}]}>
            <RText
              accessibilityRole={'header'}
              text={description}
              size={'xxs'}
              weight={'semiBold'}
            />
            {isTaco && isOptionSelectedForModifier(modifier) ? (
              <TouchableOpacity onPress={onPressChooseDifferentTaco}>
                <RText
                  size={'xxs'}
                  weight={'medium'}
                  text={'Choose a Different Taco'}
                  textStyle={{textDecorationLine: 'underline'}}
                />
              </TouchableOpacity>
            ) : null}
            {
              (modifier?.metadata?.[0]?.key === 'ChooseButtonTitle' && modifier?.metadata?.[0]?.value === 'SUB YOUR PROTEIN'
              )
              &&
            isOptionSelectedForModifier(modifier)
                  &&
                  modifier.options.length >1
                  ? (
              <TouchableOpacity onPress={onPressChooseDifferentTaco}>
                 <RText
                 size={'xxs'}
              weight={'medium'}
                      text={'Sub your protein'}
           textStyle={{textDecorationLine: 'underline'}}
                  />
               </TouchableOpacity>
        ) : null}
          </View>
        </>
      );
    }
    if (isCustomizeExpanded) {
      //No heading if edit button is pressed
      return null;
    }

    return (
      <View style={styles.modifierSimpleHeading}>
        <RText
          accessibilityRole={'header'}
          text={description || ''}
          size={withNewDesign ? 'xxs' : 'xs'}
          weight={'semiBold'}
        />
        {!withNewDesign ? <HorizontalLine style={styles.modifierHeadingHR} /> : null}
      </View>
    );
  };

  if (isProtein) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: 15,
          columnGap: getMScale(8),
          marginStart: getMScale(15),
        }}
        key={String(modifierId)}>
        {optionsJSX}
      </View>
    );
  }

  const resetProteinsChanges = useMemo(
    () =>
      isNewDesignModifier &&
      description.toLowerCase().includes('protein') &&
      isOptionSelectedForModifier(modifier),
    [isNewDesignModifier, description, isOptionSelectedForModifier],
  );

  //New UI Functionality
  const resetCustomizedChanges = useMemo(
    () => withNewDesign && isCustomizeExpanded,
    [withNewDesign, isCustomizeExpanded],
  );

  const onCollapseCustomizeSection = () => {
    dispatch(setExpandedModifiers({[modifierId]: false}));
  };

  const onPressChooseDifferentTaco = () => {
    delete checkedModifiers[modifierId];
    dispatch(resetCheckedModifiers({...checkedModifiers}));
    delete selections[modifierId];
    dispatch(defaultSelect({...selections}));
  };
  const handleResetCustomizedChanges = () => {
    const {options = []} = modifier ?? {};
    const customizeOption = options?.[1];
    const {modifiers = []} = customizeOption ?? {};
    delete checkedModifiers?.[String(modifier.parentId)];
    dispatch(resetCheckedModifiers({...checkedModifiers}));
    const defaultModifiers = getDefaultModifiers({
      modifiers,
      customizedModifierParentId: modifier.parentId,
    });
    // //removing selections that were not default leaving parent modifier
    global.modifiersWithNoDefaultOptions.forEach(
      modId => modId !== modifier.parentId && delete selections[modId],

    );
    // dispatch(defaultSelect({...selections, ...defaultModifiers}));
    const finalSelections = {...selections, ...defaultModifiers};
    for (const key in finalSelections) {
      finalSelections[key].selected = finalSelections[key].selected.filter(s => s.quantity);
    }
    dispatch(defaultSelect(finalSelections));
    global.defaultSelections = {};
    global.modifiersWithNoDefaultOptions = [];
    // onCollapseCustomizeSection();
  };

  useEffect(() => {
    const flatSelections = Object.values(selections)
      .flatMap(selection => selection.selected)
      .reduce((acc, sel) => ({...acc, [sel.optionId]: sel.quantity}), {});
    let isCurrentOptionSelected = false;
    for (const option of modifier?.options) {
      if (flatSelections[option.id]) {
        isCurrentOptionSelected = true;
      }
    }
    setSameAsChecked(
      sameAsArray?.map((sameAsOption, i) => {
        for (const key in sameAsOption.helperMap) {
          if (flatSelections[key] !== flatSelections[sameAsOption.helperMap[key]]) {
            return false;
          }
        }
        return isCurrentOptionSelected;
      }) ?? [],
    );
  }, [selections]);

  const onPressSameAs = useCallback(
    (isChecked, item) => {
      if (!selections[item?.id]) {
        return Alert.alert(
          'Please Select',
          `Please select ${item?.name.replace('Choose Your', '')} before making further selection`,
        );
      }

      dispatch(setSelectingSameOptions(true));

      dispatch(setCheckedModifier({...checkedModifiers, [modifierId]: {[item.id]: isChecked}}));
      if (isChecked) {
        const allKeys = Object.keys(item.helperMap);
        //current modifier optionIds are in values of helperMap
        // prev modifier optionIds are in keys of helperMap
        const allOptionIds = [];

        for (let key in selections) {
          const currentItem = selections[key];
          const {selected} = currentItem;

          const optionIds = selected.map(si => si.optionId);
          allOptionIds.push(...optionIds); //gathered all selected options ids of previous modifier
        }
        //collected current modifier option ids against prev selected option ids
        let choiceIds = new Set(
          allOptionIds
            .map(opt => {
              if (allKeys.includes(String(opt))) {
                if (item.helperMap[opt]) {
                  return String(item.helperMap[opt]);
                }
                return undefined;
              }
            })
            .filter(item => !!item),
        );
        defaultModifiersSetters({
          choiceIds: choiceIds,
          modifiers: allModifiers,
          isEditingProduct: true,
          customizedModifierParentId: modifierId,
          isFirstLevel: true,
        });
        dispatch(defaultSelect({...selections, ...global.defaultSelections}));
        global.defaultSelections = {};
      }
    },
    [selections],
  );

  return (
    <Fragment key={String(modifierId)}>
      <View
        style={[
          !withNewDesign ? styles.newDesignModifiersView : styles.modifierMainView,
          isLastModifier && {
            borderBottomEndRadius: 16,
            borderBottomStartRadius: 16,
          },
        ]}>
        {resetCustomizedChanges ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              columnGap: 20,
              backgroundColor: colors.secondaryColor,
              width: '100%',
              flexDirection: 'row',
              borderTopEndRadius: 16,
              borderTopStartRadius: 16,
            }}>
            <TouchableOpacity onPress={handleResetCustomizedChanges} style={{alignSelf: 'center'}}>
              <RText
                text={'Undo Changes'}
                color={colors.white}
                size={'xxs'}
                weight={'medium'}
                textStyle={{textDecorationLine: 'underline', marginVertical: 8}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCollapseCustomizeSection}>
              <ArrowDown />
            </TouchableOpacity>
          </View>
        ) : null}
        {/*{resetProteinsChanges ? (*/}
        {/*  <TouchableOpacity onPress={onResetProteinsChanges}>*/}
        {/*    <RText*/}
        {/*      text={'Reset Changes'}*/}
        {/*      color={colors.secondary}*/}
        {/*      weight={'medium'}*/}
        {/*      size={'xs'}*/}
        {/*      textStyle={{textDecorationLine: 'underline'}}*/}
        {/*    />*/}
        {/*  </TouchableOpacity>*/}
        {/*) : null}*/}
        {renderOptionsHeading()}

        <View style={{flexDirection: 'row', columnGap: 8}}>
          {sameAsArray?.map((item, i) => {
            const selected =
              checkedModifiers?.[String(modifierId)]?.[String(item?.id)] ||
              (isEditingProduct && selectingSameOptions);

            return (
              <CheckBox
                checked={sameAsChecked[i]}
                height={16}
                onValueChange={isChecked => onPressSameAs(isChecked, item)}
                width={16}
                text={'Same as ' + item.name}
                style={{width: '45%'}}
                textSize={'xxs'}
                textWeight={'medium'}
              />
            );
          })}
        </View>
        {optionsJSX}
      </View>
      {modifierJSX}
    </Fragment>
  );
};

export default React.memo(NewOptionsGroup);
