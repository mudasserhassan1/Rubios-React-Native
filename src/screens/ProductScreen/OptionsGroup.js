import {useDispatch, useSelector} from 'react-redux';
import React, {Fragment, useCallback, useMemo} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import styles from './styles';

import OptionItem from './OptionItem';
import OptionsMapper from './OptionsMapper';
import RText from '../../components/RText';
import {defaultSelect, selectOption} from '../../redux/actions/product/selections';
import OptionToggle from './OptionToggle';
import HorizontalLine from './HorizontalLine';
import CheckBox from '../../components/CheckBox/CheckBox';
import {colors} from '../../theme';
import ArrowDown from '../../assets/svgs/ArrowDown';
import {
  resetCheckedModifiers,
  setCheckedModifier,
  setExpandedModifiers,
} from '../../redux/actions/product/option';
import {defaultModifiersSetters} from '../../utils/productUtils';
import {getMScale} from '../../theme/metrics';
import {logToConsole} from '../../configs';

const OptionsGroup = ({
  modifier,
  isProtein,
  customOptionSelectionHandler,
  isCustomizeExpanded = false,
  withNewDesign = false,
  isLastModifier,
  isEditingProduct = false,
}) => {
  const checkedModifiers = useSelector(state => state.productOptions.checkedModifiers);

  const {
    id: modifierId,
    description,
    options,
    isToggleModifier,
    isFirstLevel,
    supportsNewDesign,
    parentName,
    sameAsArray = [],
  } = modifier || {};

  const selections = useSelector(state => state?.productSelections);
  const allModifiers = useSelector(state => state.productOptions?.options?.optiongroups);

  const selectedOptions = useMemo(
    () => selections?.[modifierId]?.selected || [],
    [modifierId, selections],
  );

  const {new_design_modifiers = ''} = useSelector(state => state.firebaseConfig.config);
  const dispatch = useDispatch();

  const newDesignModifiers = [
    '1289319899',
    '1289319901',
    '2722645943',
    '2722645948',
    '2722645949',
    '2722645950',
    '2722645945',
    ...new_design_modifiers?.split(','),
  ];

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
    logToConsole({handleSameTacoUnselection: checkedModifiers});
    Object.keys(checkedModifiers).forEach(key => {
      const valueObj = checkedModifiers[key];
      if (valueObj[modifier.parentId]) {
        delete checkedModifiers[key];
      }
    });
    delete checkedModifiers[modifier?.parentId];
    dispatch(resetCheckedModifiers({...checkedModifiers}));
    // logToConsole({itemObj, checkedModifiers});
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

  const isNewDesignModifier = newDesignModifiers.includes(String(modifierId));

  const {optionsJSX, modifierJSX} = useMemo(() => {
    //UI to render Single Option after selection for new design
    let [optionsUI, modifiersUI] = [[], []];
    if (
      isNewDesignModifier &&
      isOptionSelectedForModifier(modifier) &&
      !description.toLowerCase().includes('protein')
    ) {
      const indexOf = options.map(opt => opt.id).indexOf(selectedOptions[0].optionId); //find selected option for modifier
      const optionItem = options[indexOf];
      const {modifiers, id: optionId, isDropDownItem, name, supportsNewDesign} = optionItem ?? {};

      const isSelected = selectedOptions?.find?.(so => so?.optionId === optionId);
      if (optionsUI.length > 0) {
        optionsUI = optionsUI.slice(indexOf, indexOf);
      } else {
        if (!isToggleModifier) {
          //push selected option into separate instance of OptionsUI array
          optionsUI.push(
            <OptionItem
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
            />,
          );
        }
      }
      const isCustomizeNewDesign = name === 'Customize' && supportsNewDesign;
      if (isSelected && !isDropDownItem && !isProtein) {
        if (isCustomizeNewDesign && !isCustomizeExpanded) {
        } else {
          modifiersUI.push(
            <OptionsMapper
              modifiers={modifiers}
              key={String(optionId)}
              withNewDesign={withNewDesign}
            />,
          );
        }
      }
    } else {
      //Old Implementation
      (options || []).forEach((option, index) => {
        const {modifiers, id: optionId, isDropDownItem, name, supportsNewDesign} = option || {};
        const isSelected = selectedOptions?.find?.(so => so?.optionId === optionId);
        if (!isToggleModifier) {
          optionsUI.push(
            <OptionItem
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
              isNewDesignModifier={isNewDesignModifier}
            />,
          );
        }
        const isCustomizeNewDesign = name === 'Customize' && supportsNewDesign;
        if (isSelected && !isDropDownItem && !isProtein) {
          if (isCustomizeNewDesign && !isCustomizeExpanded) {
          } else {
            modifiersUI.push(
              <OptionsMapper
                modifiers={modifiers}
                key={String(optionId)}
                withNewDesign={withNewDesign}
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

  const renderOptionsHeading = () => {
    if (isToggleModifier && !isCustomizeExpanded) {
      //do not repeat Customize Card if Edit button is pressed
      return (
        <>
          <HorizontalLine style={{marginBottom: 8}} />
          <OptionToggle onSelectOption={onSelectOption} modifier={modifier} />
        </>
      );
    }
    if (
      (isFirstLevel || (supportsNewDesign && parentName.toLowerCase().includes('protein'))) &&
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
    logToConsole({onPressChooseDifferentTaco: checkedModifiers});
    dispatch(resetCheckedModifiers({...checkedModifiers}));
    delete selections[modifierId];
    dispatch(defaultSelect({...selections}));
  };

  const handleResetCustomizedChanges = () => {
    const {options = []} = modifier ?? {};
    const customizeOption = options?.[1];
    const {modifiers = []} = customizeOption ?? {};
    delete checkedModifiers?.[String(modifier.parentId)];
    logToConsole({handleResetCustomizedChanges: checkedModifiers, selections});
    dispatch(resetCheckedModifiers({...checkedModifiers}));
    defaultModifiersSetters({modifiers, customizedModifierParentId: modifier.parentId});
    //removing selections that were not default leaving parent modifier
    global.modifiersWithNoDefaultOptions.forEach(
      modId => modId !== modifier.parentId && delete selections[modId],
    );
    dispatch(defaultSelect({...selections, ...global.defaultSelections}));
    global.defaultSelections = {};
    global.modifiersWithNoDefaultOptions = [];
    onCollapseCustomizeSection();
  };

  const onPressSameAs = useCallback(
    (isChecked, item) => {
      if (!selections[item?.id]) {
        return Alert.alert(
          'Please Select',
          `Please select ${item?.name.replace('Choose Your', '')} before making further selection`,
        );
      }
      logToConsole({onPressSameAs: checkedModifiers, [modifierId]: {[item.id]: isChecked}});
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
          withNewDesign ? styles.newDesignModifiersView : styles.modifierMainView,
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
        <View style={{flexDirection: 'row', columnGap: 8, marginVertical: 5}}>
          {sameAsArray?.map(item => {
            const selected = checkedModifiers?.[String(modifierId)]?.[String(item?.id)];
            return (
              <CheckBox
                checked={selected}
                height={16}
                onValueChange={isChecked => onPressSameAs(isChecked, item)}
                width={16}
                text={item.name?.replace('Choose Your', 'Same as')}
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

export default React.memo(OptionsGroup);
