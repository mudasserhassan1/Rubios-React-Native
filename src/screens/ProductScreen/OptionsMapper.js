import React from 'react';
import OptionsGroup from './OptionsGroup';

const OptionsMapper = ({
  modifiers = [],
  isProtein,
  customOptionSelectionHandler,
  withNewDesign = false,
  onResetProteinsChanges,
  isEditingProduct = false,
}) => {
  const renderOptionsGroup = (modifier, index) => {
    return (
      <OptionsGroup
        isProtein={isProtein}
        modifier={modifier}
        isLastModifier={index === modifiers.length - 1}
        withNewDesign={withNewDesign}
        customOptionSelectionHandler={customOptionSelectionHandler}
        onResetProteinsChanges={onResetProteinsChanges}
        isEditingProduct={isEditingProduct}
        key={String(modifier?.id || index)}
      />
    );
  };

  if (Array.isArray(modifiers) && modifiers?.length) {
    return modifiers.map(renderOptionsGroup);
  }

  return null;
};

export default React.memo(OptionsMapper);
