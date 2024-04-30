import axios from 'axios';
import {setModifierImages} from '../redux/actions/product/images';
import {store} from '../redux/store';
import {logToConsole} from '../configs';
import {unixTime} from './timeUtils';
import {changeImageSize} from '../helpers/common';
import {setProductImages} from '../redux/actions/category';
import _ from 'lodash';

let startId = 555500000000;
const GROUP_NAME = 'display-group-name';
const GROUP_OPTION_NAME = 'display-group-option-name';

global.selections = {};
global.defaultSelections = {};
global.modifiersWithNoDefaultOptions = [];
export const defaultModifiersSetters = ({
  modifiers,
  isEditingProduct,
  isZeroIndexAlternate,
  choiceIds = new Set(),
  isFirstLevel = false,
  customizedModifierParentId,
}) => {
  if (!modifiers?.length) {
    return;
  }
  //customizedModifiersParentId is used to restrict selection upto single parent modifier. helpful in reset single modifier
  const mainStoreObjectRef = customizedModifierParentId
    ? global.defaultSelections
    : global.selections;
  modifiersStart: for (let modifier of modifiers) {
    const {
      id: modifierId,
      mandatory,
      description,
      minselects,
      maxselects,
      minaggregatequantity,
      parentId,
      maxaggregatequantity,
      metadata: modifierMeta = [],
      options = [],
    } = modifier || {};
    let isDefaultFound = false;
    let isToggleModifier = description === 'As is or Customize?';
    modifier.isFirstLevel = isFirstLevel;
    modifier.isToggleModifier = isToggleModifier;
    modifier.minSelects = parseInt(minselects ?? (mandatory ? 1 : 0));
    modifier.maxSelects = parseInt(maxselects ?? (mandatory ? 1 : options.length));
    modifier.minAggregateQuantity = parseInt(minaggregatequantity ?? (mandatory ? 1 : 0));
    modifier.maxAggregateQuantity = parseInt(
      maxaggregatequantity ?? (mandatory ? 1 : options.length),
    );
    if (
      modifierMeta?.length === 1 &&
      modifierMeta?.[0]?.value === 'input' &&
      modifierMeta?.[0]?.key === 'quantity-choice-view'
    ) {
      modifier.isQuantityStepper = true;
    }
    let defaultOption;
    let preSelectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      //start from modifier if parentId is not same only in case customizedParenId is passed.
      if (customizedModifierParentId && parentId !== customizedModifierParentId) {
        continue modifiersStart;
      }
      let isDropDownItem = false;
      const {isdefault, id: optionId, name, modifiers, metadata: optionMeta} = options[i] || {};

      if (
        optionMeta?.length === 1 &&
        optionMeta[0].value === 'inline' &&
        optionMeta[0].key === 'navigation-style'
      ) {
        isDropDownItem = true;
        options[i].isDropDownItem = true;
      }
      isDefaultFound = isEditingProduct ? choiceIds.has(String(optionId)) : isdefault;
      //workaround for proteins selection reset
      if (isdefault && isEditingProduct) {
        defaultOption = options[i];
        preSelectedOptions.push(options[i]);
      }
      let option;
      if (isDefaultFound) {
        option = {optionId, name, optionIndex: i, quantity: 1};
        const previouslySelected = mainStoreObjectRef?.[modifierId]?.selected || [];
        if (modifier.isQuantityStepper) {
          if (previouslySelected.length) {
            previouslySelected[0].quantity -= 1;
          } else {
            option.quantity = modifier.minAggregateQuantity;
          }
        }
        mainStoreObjectRef[modifierId] = {
          description,
          selected: [...previouslySelected, option],
        };
      }
      defaultModifiersSetters({
        isZeroIndexAlternate: isDropDownItem && !isDefaultFound,
        modifiers,
        choiceIds,
        isEditingProduct,
        customizedModifierParentId,
      });
    }
    if (customizedModifierParentId && !isDefaultFound) {
      global.modifiersWithNoDefaultOptions.push(modifierId);
    }
    //workaround for proteins selection reset
    if (isEditingProduct && defaultOption && !mainStoreObjectRef[modifierId]) {
      const {id: optionId, name} = defaultOption || {};
      mainStoreObjectRef[modifierId] = {
        description,
        selected: [{optionId, name, optionIndex: 0, quantity: 1}],
      };
    }
    if (!isDefaultFound && isZeroIndexAlternate) {
      const {id: optionId, name} = options?.[0] || {};
      // if (name.toLowerCase().trim() !== 'remove') {
      //
      // }
      mainStoreObjectRef[modifierId] = {
        description,
        selected: [{optionId, name, optionIndex: 0, quantity: 1}],
      };
    }
  }
};

export const getDefaultModifiers = ({
  modifiers,
  isZeroIndexAlternate,
  choiceIds = new Set(),
  isFirstLevel = false,
  customizedModifierParentId,
}) => {
  if (!modifiers?.length) {
    return {};
  }
  //customizedModifiersParentId is used to restrict selection upto single parent modifier. helpful in reset single modifier
  let response = {};
  modifiersStart: for (let modifier of modifiers) {
    const {
      id: modifierId,
      mandatory,
      description,
      minselects,
      maxselects,
      minaggregatequantity,
      parentId,
      maxaggregatequantity,
      metadata: modifierMeta = [],
      options = [],
    } = modifier || {};
    let isDefaultFound = false;
    let isToggleModifier = description === 'As is or Customize?';
    modifier.isFirstLevel = isFirstLevel;
    modifier.isToggleModifier = isToggleModifier;
    modifier.minSelects = parseInt(minselects ?? (mandatory ? 1 : 0));
    modifier.maxSelects = parseInt(maxselects ?? (mandatory ? 1 : options.length));
    modifier.minAggregateQuantity = parseInt(minaggregatequantity ?? (mandatory ? 1 : 0));
    modifier.maxAggregateQuantity = parseInt(
      maxaggregatequantity ?? (mandatory ? 1 : options.length),
    );
    if (
      modifierMeta?.length === 1 &&
      modifierMeta?.[0]?.value === 'input' &&
      modifierMeta?.[0]?.key === 'quantity-choice-view'
    ) {
      modifier.isQuantityStepper = true;
    }
    let defaultOption;
    let preSelectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      //start from modifier if parentId is not same only in case customizedParenId is passed.
      if (customizedModifierParentId && parentId !== customizedModifierParentId) {
        continue modifiersStart;
      }
      let isDropDownItem = false;
      const {isdefault, id: optionId, name, modifiers, metadata: optionMeta} = options[i] || {};

      if (
        optionMeta?.length === 1 &&
        optionMeta[0].value === 'inline' &&
        optionMeta[0].key === 'navigation-style'
      ) {
        isDropDownItem = true;
        options[i].isDropDownItem = true;
      }
      isDefaultFound = isdefault;
      //workaround for proteins selection reset
      if (isdefault) {
        defaultOption = options[i];
        preSelectedOptions.push(options[i]);
      }
      let option;
      // if (isDefaultFound) {
      //   option = {optionId, name, optionIndex: i, quantity: 1};
      //   const previouslySelected = response[modifierId]?.selected || [];
      //   if (modifier.isQuantityStepper) {
      //     if (previouslySelected.length) {
      //       previouslySelected[0].quantity -= 1;
      //     } else {
      //       option.quantity = modifier.minAggregateQuantity;
      //     }
      //
      //   }
      //   else {
      //     option = {optionId, name, optionIndex: i, quantity: 0};
      //   }
      //
      //   response[modifierId] = {
      //     description,
      //     selected: [...previouslySelected, option],
      //   };
      // }

      const previouslySelected = response[modifierId]?.selected || [];
      if (isDefaultFound) {
        option = {optionId, name, optionIndex: i, quantity: 1};
        if (modifier.isQuantityStepper) {
          if (previouslySelected.length) {
            previouslySelected[0].quantity -= 1;
          } else {
            option.quantity = modifier.minAggregateQuantity;
          }
        }
      } else {
        option = {optionId, name, optionIndex: i, quantity: 0};
      }
      response[modifierId] = {
        description,
        selected: [...previouslySelected, option],
      };

      response = {
        ...response,
        ...getDefaultModifiers({
          isZeroIndexAlternate: isDropDownItem && !isDefaultFound,
          modifiers,
          choiceIds,
          customizedModifierParentId,
        }),
      };
    }
    if (customizedModifierParentId && !isDefaultFound) {
      global.modifiersWithNoDefaultOptions.push(modifierId);
    }
    //workaround for proteins selection reset
    if (defaultOption && !response[modifierId]) {
      const {id: optionId, name} = defaultOption || {};
      response[modifierId] = {
        description,
        selected: [{optionId, name, optionIndex: 0, quantity: 1}],
      };
    }
    if (!isDefaultFound && isZeroIndexAlternate) {
      const {id: optionId, name} = options?.[0] || {};
      // if (name.toLowerCase().trim() !== 'remove') {
      //
      // }
      response[modifierId] = {
        description,
        selected: [{optionId, name, optionIndex: 0, quantity: 1}],
      };
    }
  }
  return response;
};

const getAllOptionNames = (options = [], prefix = '') => {
  return (
    options?.flatMap(option => [
      `${prefix}(${option.name})`,
      ...getAllOptionNamesFromModifiers(option.modifiers, `${prefix}(${option.name}).`),
    ]) ?? []
  );
};

const getAllOptionNamesFromModifiers = (optionsGroups, prefix = '') => {
  return (
    optionsGroups?.flatMap(optionsGroup => [
      // ...optionsGroup.preselectedOptions.map(
      //     (o) => `${prefix}(${o.name})`,
      // ),
      ...getAllOptionNames(optionsGroup.options, prefix),
      ...getAllOptionNamesFromModifiers(optionsGroup.modifiers, prefix),
    ]) ?? []
  );
};

const getAllOptionIds = (options = [], key = 'id') => {
  return (
    options?.flatMap(option => [
      option[key],
      ...getAllOptionIdsFromModifiers(option.modifiers, key),
    ]) ?? []
  );
};

const getAllOptionIdsFromModifiers = (optionsGroups = [], key = 'id') => {
  return (
    optionsGroups?.flatMap(optionsGroup => [
      // ...optionsGroup.preselectedOptions.map((o) => o[key]),
      ...getAllOptionIds(optionsGroup.options, key),
      ...getAllOptionIdsFromModifiers(optionsGroup.modifiers, key),
    ]) ?? []
  );
};

// const setIdentifiersForAllChildren = (optionGroup, parentId, parentName, newDesignModifiers) => {
const setIdentifiersForAllChildren = (optionGroup, parentId, parentName) => {
  // logToConsole({setIdentifiersForAllChildren:true, newDesignModifiers})
  const newDesign = true;
  optionGroup.parentId = parentId;
  optionGroup.parentName = parentName;
  // optionGroup.supportsNewDesign = newDesignModifiers.includes(String(parentId));
  // optionGroup.supportsNewDesignCustomize =
  //   optionGroup?.description === 'As is or Customize?' &&
  //   newDesignModifiers.includes(String(parentId));

  optionGroup.supportsNewDesign = newDesign;
  optionGroup.supportsNewDesignCustomize =
    optionGroup?.description === 'As is or Customize?' && newDesign;
  optionGroup.modifiers?.forEach(modifier => {
    // setIdentifiersForAllChildren(modifier, parentId, parentName, newDesignModifiers);
    setIdentifiersForAllChildren(modifier, parentId, parentName);
  });
  optionGroup.options?.forEach(option => {
    option.parentId = parentId;
    option.parentName = parentName;
    // option.supportsNewDesign = newDesignModifiers.includes(String(parentId));
    // option.supportsNewDesignCustomize =
    //   option?.name === 'As is or Customize?' && newDesignModifiers.includes(String(parentId));
    option.supportsNewDesign = newDesign;
    option.supportsNewDesignCustomize = option?.name === 'As is or Customize?' && newDesign;
    option.modifiers?.forEach(modifier => {
      // setIdentifiersForAllChildren(modifier, parentId, parentName, newDesignModifiers);
      setIdentifiersForAllChildren(modifier, parentId, parentName);
    });
  });
};

// export const getNewMenuOptionGroups = (optionGroups, newDesignModifiers) => {
export const getNewMenuOptionGroups = optionGroups => {
  const simplifiedOptionGroups = optionGroups;
  if (simplifiedOptionGroups) {
    for (let i = 0; i < simplifiedOptionGroups.length; i++) {
      if (
        simplifiedOptionGroups[i].options?.length === 1 &&
        simplifiedOptionGroups[i].options[0].name.toLowerCase().includes('taco')
      ) {
        const parentOption = {
          ...simplifiedOptionGroups[i]?.options?.[0],
          modifiers: null,
        };
        simplifiedOptionGroups[i] = simplifiedOptionGroups[i]?.options?.[0]?.modifiers?.[0];
        simplifiedOptionGroups[i].preselectedOptions = [
          {
            id: parentOption.id,
            name: parentOption.name,
            cost: +parentOption.cost,
          },
        ];
      }
    }
    const previousComplexOptionGroupsHelperMap = {};

    let sameAsArray = [];
    for (let i = 0; i < simplifiedOptionGroups.length; i++) {
      if (
        simplifiedOptionGroups[i].options?.[0]?.modifiers?.length === 1 &&
        simplifiedOptionGroups[i].options?.[0]?.modifiers?.[0]?.description ===
          'As is or Customize?'
      ) {
        simplifiedOptionGroups[i].type = 'optionsWithCustomization';
        // setIdentifiersForAllChildren(
        //     simplifiedOptionGroups[i],
        //     simplifiedOptionGroups[i].id,
        //     simplifiedOptionGroups[i].description,
        //     newDesignModifiers,
        // );
        setIdentifiersForAllChildren(
          simplifiedOptionGroups[i],
          simplifiedOptionGroups[i].id,
          simplifiedOptionGroups[i].description,
        );
        simplifiedOptionGroups[i].sameAsArray = [...sameAsArray.map(s => ({...s}))];
        for (let j = 0; j < simplifiedOptionGroups[i].options.length; j++) {
          if (
            simplifiedOptionGroups[i]?.options?.[j].modifiers?.length &&
            simplifiedOptionGroups[i]?.options?.[j].modifiers?.[0].description ===
              'As is or Customize?'
          ) {
            simplifiedOptionGroups[i].options[j].modifiers[0].isComplex = true;
          }
        }

        const allIds = getAllOptionIds(simplifiedOptionGroups[i].options, 'id');
        const allUniqueNames = getAllOptionNames(simplifiedOptionGroups[i].options);
        const allNamesMap = allUniqueNames.reduce((acc, name, index) => {
          acc[name] = allIds[index];
          return acc;
        }, {});
        for (const key in previousComplexOptionGroupsHelperMap) {
          if (
            allUniqueNames.length ===
            _.intersection(
              allUniqueNames,
              Object.keys(previousComplexOptionGroupsHelperMap[key].allNamesMap),
            ).length
          ) {
            const helperMap = {};
            for (const name in allNamesMap) {
              helperMap[+previousComplexOptionGroupsHelperMap[key].allNamesMap[name]] =
                +allNamesMap[name];
            }

            simplifiedOptionGroups[i].sameAsArray?.push({
              id: +key,
              name: previousComplexOptionGroupsHelperMap[key].name,
              helperMap,
            });
          }
        }

        previousComplexOptionGroupsHelperMap[simplifiedOptionGroups[i].id] = {
          name: simplifiedOptionGroups[i].description,
          allNamesMap,
        };
      }
    }
  }
  return {
    options: simplifiedOptionGroups,
  };
};

export const formatModifiers = (options, choiceIds = new Set(), isNewDesign) => {
  let allModifiers = options?.optiongroups;
  const {new_design_modifiers = ''} = store.getState().firebaseConfig?.config;
  // const newDesignModifiers = [
  //   '1289319899',
  //   '1289319901',
  //   '2722645943',
  //   '2722645948',
  //   '2722645949',
  //   '2722645950',
  //   '2722645945',
  //   ...new_design_modifiers?.split(','),
  // ];

  try {
    if (allModifiers) {
      // Implementation for new design items/modifiers
      // getNewMenuOptionGroups(allModifiers, newDesignModifiers);
      // TODO: isNewDesign
      if (isNewDesign) {
        getNewMenuOptionGroups(allModifiers);
      }
      //old implementation
      for (let modifier of allModifiers) {
        let {options = [], description = ''} = modifier || {};
        let indexesToSplice = [];
        for (let i = 0; i < options?.length; i++) {
          let prevIndex = -1;
          let {
            metadata,
            name,
            chainoptionid,
            isdefault,
            id: optionId,
            modifiers,
            ...rest
          } = options[i] || {};
          if (metadata?.length === 2) {
            for (let meta of metadata) {
              const newId = startId + i + 100;
              if (meta.key === GROUP_OPTION_NAME) {
                prevIndex = options.findIndex(item => {
                  return meta.value === item?.name;
                });
                if (prevIndex !== -1) {
                  if (choiceIds.has(String(optionId))) {
                    choiceIds.add(String(options[prevIndex].id));
                  }
                  options[prevIndex] = {
                    ...options[prevIndex],
                    metadata: [{key: 'navigation-style', value: 'inline'}],
                    modifiers: [
                      {
                        mandatory: true,
                        ...(options[prevIndex]?.modifiers?.[0] || {}),
                        options: [
                          ...(options[prevIndex]?.modifiers?.[0]?.options || []),
                          ...(options[i]?.modifiers?.[0]?.options || []),
                        ],
                      },
                    ],
                  };
                }
                startId = newId;
                options[i] = {
                  isdefault,
                  chainoptionid,
                  name: meta.value,
                  id: newId,
                  isCustomId: true,
                  parentName: description,
                  modifiers: options[i].modifiers,
                };
                //Assuming else will run first
              } else if (meta.key === GROUP_NAME) {
                if (choiceIds.has(String(optionId))) {
                  choiceIds.add(String(newId));
                }
                options[i].modifiers = [
                  {
                    chainmodifierid: unixTime() + 1500,
                    id: unixTime() + 220 + i,
                    isUnixId: true,
                    description: name,
                    parentName: description, // for new design
                    options: [{...rest, id: optionId, isdefault, name: meta.value}],
                  },
                ];
              }
            }
          }
          // else {
          //   if (choiceIds.has(String(optionId))) {
          //     choiceIds.add(String(options[prevIndex].id));
          //   }
          // }
          prevIndex !== -1 && indexesToSplice.push(i);
        }
        for (let k = indexesToSplice.length - 1; k > -1; k--) {
          options.splice(indexesToSplice[k], 1);
        }
      }
    }
    options.optiongroups = allModifiers;
    return options;
  } catch (e) {
    logToConsole({e, message: e?.message});
    return options;
  }
};

export const getProductImages = (data, imageGroup = 'marketplace-product') => {
  let productImages = {};
  const {categories = [], imagepath = ''} = data || {};
  for (let category of categories) {
    const {products = []} = category || {};
    for (let product of products) {
      const {images = [], id, imagefilename = ''} = product || {};
      if (imagepath && imagefilename && images.length > 0) {
        const imageUrl = imagepath + changeImageSize(imagefilename, images, imageGroup) || '';
        productImages = {
          ...productImages,
          [id]: imageUrl,
        };
      }
    }
  }
  store.dispatch(setProductImages(productImages));
  return productImages;
};

export const getOptionsImages = options => {
  const {config = {}} = store.getState().firebaseConfig || {};
  const {ingredient_url = ''} = config || {};

  const ids = {};
  JSON.stringify(options, (key, value) => {
    if (key === 'chainoptionid') {
      ids[value] = '';
    }
    return value;
  });
  const idsArray = Object.keys(ids);
  if (idsArray.length) {
    try {
      const url = ingredient_url?.replace('*yourplu*', idsArray.toString());
      const promise = axios.get(url || '');
      promise.then(response => {
        if (response.data.length > 0) {
          top: for (let optionChainId of idsArray) {
            for (let item of response.data) {
              if (item?.production_plu_names?.includes(String(optionChainId))) {
                if (ids[optionChainId] === '' || ids[optionChainId] === undefined) {
                  ids[optionChainId] = item?.fimg_url ? String(item?.fimg_url) : '';
                }
                if (ids[optionChainId]) {
                  continue top;
                }
              }
            }
          }
        }
        store.dispatch(setModifierImages({data: ids}));
      });
    } catch (error) {
      throw error;
    }
  }
};

global.enabled = true;

export const priceCalculator = ({modifiers, selections, optionIDs = [], enabled = true}) => {
  let price = 0;
  if (modifiers) {
    for (let modifier of modifiers) {
      const {id: modifierId, options, minSelects} = modifier || {};
      const selectedOptions = selections?.[modifierId]?.selected || [];
      if (selectedOptions?.length) {
        for (let {optionIndex, optionId, quantity} of selectedOptions) {
          let {cost, modifiers: nestedModifiers, isCustomId} = options[optionIndex] || {};
          if (!isCustomId && !optionIDs.includes(optionId)) {
            optionIDs.push(...Array.from({length: quantity || 1}).map(() => optionId));
          }
          cost = parseFloat(cost || 0);
          const {price: prevPrice = 0.0} = priceCalculator({
            modifiers: nestedModifiers,
            selections,
            optionIDs,
            enabled,
          });
          price =
            (isNaN(price) ? 0 : price) +
            quantity * (isNaN(cost) ? 0 : cost) +
            (isNaN(prevPrice) ? 0 : prevPrice);
        }
      } else if (minSelects) {
        global.enabled = false;
      }
    }
  }
  return {price, enabled: global.enabled, optionIDs};
};

export const getCaloriesCostString = ({cost, basecalories, maxcalories} = {}) => {
  let calCostStr = '';
  const costFlt = parseFloat(cost || '0');
  const baseCalFlt = parseFloat(basecalories || '0');
  const maxCalFlt = parseFloat(maxcalories || '0');
  if (costFlt) {
    calCostStr = `$${costFlt.toFixed(2)}`;
  }
  if (baseCalFlt) {
    calCostStr = `${calCostStr}${calCostStr ? '\n' : ''}${baseCalFlt} Cals`;
  }
  if (maxCalFlt) {
    calCostStr = `${calCostStr}${calCostStr ? '\n' : ''} ${maxCalFlt} Cals`;
  }
  return calCostStr;
};

export const getAddToBagAnalyticsObjectForSelections = selections => {
  let object = {
    option_side_1: '',
    option_side_2: '',
    option_drink: '',
    option_protein: '',
    option_beans: '',
    option_quesadilla: '',
  };
  Object.values(selections).forEach(selectionItem => {
    const {description = '', selected = []} = selectionItem || {};
    const {name = ''} = selected?.[0] || {};
    if (
      description?.toLowerCase()?.includes('first side') ||
      description?.toLowerCase()?.includes('your side')
    ) {
      object.option_side_1 = name;
    }
    if (description?.toLowerCase()?.includes('second side')) {
      object.option_side_2 = name;
    }
    if (description?.toLowerCase()?.includes('protein')) {
      object.option_protein = name;
    }
    if (description?.toLowerCase()?.includes('your beans')) {
      object.option_beans = name;
    }
    if (
      description?.toLowerCase()?.includes('choose your drink') ||
      description?.toLowerCase()?.includes('choose a beverage')
    ) {
      object.option_drink = name;
    }
    if (description?.toLowerCase()?.includes('quesadilla')) {
      object.option_quesadilla = name;
    }
  });
  return object;
};
