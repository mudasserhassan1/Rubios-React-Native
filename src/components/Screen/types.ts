import {Edge} from 'react-native-safe-area-context';
import {
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  StatusBarProps,
  ImageBackgroundProps,
} from 'react-native';
import React, {Ref} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface BaseScreenProps {
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * Style for the outer content container useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the inner content container useful for padding & margin.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: Edge[];
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Status bar setting. Defaults to dark.
   */
  statusBarStyle?: 'light' | 'dark';
  /**
   * By how much should we offset the keyboard? Defaults to 0.
   */
  keyboardOffset?: number;
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  StatusBarProps?: StatusBarProps;
  /**
   * Pass any additional props directly to the KeyboardAvoidingView component.
   */
  loading?: false;
  containerStyle?: StyleProp<ViewStyle>;
}
export interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed';
  withHeader?: true;
  backgroundImage?: ImageBackgroundProps;
}
export interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll';
  withHeader?: true;
  extraHeight?: number;
  extraScrollHeight?: number;
  enableOnAndroid?: Boolean;
  scrollRef?: Ref<KeyboardAwareScrollView>;
  backgroundImage?: ImageBackgroundProps;
  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  /**
   * Pass any additional props directly to the ScrollView component.
   */
  ScrollViewProps?: ScrollViewProps;
  containerStyle?: StyleProp<ViewStyle>;
}
export interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto';
  withHeader?: true;
  extraHeight?: number;
  extraScrollHeight?: number;
  backgroundImage?: ImageBackgroundProps;
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: {percent?: number; point?: number};
}
export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps;
