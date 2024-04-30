import React from 'react';
import {View, ViewStyle, ImageBackground} from 'react-native';
import {Edge, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme';
import styles from './styles';
import {ScreenProps, ScrollScreenProps} from './types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SpinnerOverly from '../LoadingComponent/SpinnerOverly';

function isNonScrolling(preset?: ScreenProps['preset']) {
  return !preset || preset === 'fixed';
}

function useSafeAreaInsetPadding(safeAreaEdges?: Edge[]) {
  const insets = useSafeAreaInsets();

  const insetStyles: ViewStyle = {};
  safeAreaEdges?.forEach((edge: Edge) => {
    const paddingProp = `padding${edge.charAt(0).toUpperCase()}${edge.slice(1)}`;
    // @ts-ignore
    insetStyles[paddingProp] = insets[edge];
  });

  return insetStyles;
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const {style, children} = props;
  return <View style={[styles.outerStyle, style]}>{children}</View>;
}

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    contentContainerStyle,
    ScrollViewProps,
    extraHeight = 50,
    extraScrollHeight = 50,
    style,
  } = props as ScrollScreenProps;

  // Add native behavior of pressing the active tab to scroll to the top of the content
  // More info at: https://reactnavigation.org/docs/use-scroll-to-top/

  return (
    <KeyboardAwareScrollView
      {...{keyboardShouldPersistTaps}}
      {...ScrollViewProps}
      extraHeight={extraHeight}
      extraScrollHeight={extraScrollHeight}
      showsVerticalScrollIndicator={false}
      // enableOnAndroid={true}
      style={[styles.outerStyle, ScrollViewProps?.style, style]}
      contentContainerStyle={[
        styles.innerStyle,
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}>
      {children}
    </KeyboardAwareScrollView>
  );
}

export function Screen(props: ScreenProps) {
  const {
    backgroundColor = colors.background,
    safeAreaEdges = ['top', 'left', 'right', 'bottom'],
    withHeader = false,
    loading = false,
    backgroundImage,
    containerStyle,
  } = props;

  const insetPadding = useSafeAreaInsetPadding(safeAreaEdges);

  const ScreenWrapper = isNonScrolling(props.preset) ? ScreenWithoutScrolling : ScreenWithScrolling;
  const ParentWrapper = backgroundImage ? ImageBackground : View;
  // @ts-ignore
  return (
    <ParentWrapper
      source={backgroundImage}
      style={[
        styles.containerStyle,
        {backgroundColor},
        !withHeader && {...insetPadding},
        containerStyle,
      ]}>
      <ScreenWrapper {...props} />
      <SpinnerOverly isLoading={loading} withHeader={withHeader} containerStyle={{}} />
    </ParentWrapper>
  );
}
