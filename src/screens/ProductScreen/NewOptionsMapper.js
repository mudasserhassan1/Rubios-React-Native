import React from 'react';
import NewOptionsGroup from './NewOptionsGroup';

const NewOptionsMapper = ({
  modifiers = [],
  isProtein,
  customOptionSelectionHandler,
  onResetProteinsChanges,
  isEditingProduct = false,
  metaData,
  showDrinksModal,
}) => {
  // let withNewDesign = false;
  // let isNewMenuValue = metaData?.find(item => item?.key === 'isNewMenu');
  // if (isNewMenuValue) {
  //   withNewDesign = isNewMenuValue.value.toLowerCase() === 'true';
  // } else {
  //   withNewDesign = false;
  // }

  const renderOptionsGroup = (modifier, index) => {
    return (
      <NewOptionsGroup
        isProtein={isProtein}
        modifier={modifier}
        isLastModifier={index === modifiers.length - 1}
        withNewDesign={metaData}
        customOptionSelectionHandler={customOptionSelectionHandler}
        onResetProteinsChanges={onResetProteinsChanges}
        isEditingProduct={isEditingProduct}
        key={String(modifier?.id || index)}
        showDrinksModal={showDrinksModal}
      />
    );
  };

  if (Array.isArray(modifiers) && modifiers?.length) {
    return modifiers.map(renderOptionsGroup);
  }

  return null;
};

export default React.memo(NewOptionsMapper);
