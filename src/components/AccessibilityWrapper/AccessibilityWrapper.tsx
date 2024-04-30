import React from 'react'
import PropTypes from 'prop-types'
import {
    NativeModules,
    ViewProps,
    findNodeHandle,
    requireNativeComponent,
    Platform,
    View
} from 'react-native'
// @ts-ignore
import {ViewPropTypes} from 'deprecated-react-native-prop-types';

const { RNAccessibilityWrapperManager } = NativeModules

const RNAccessibilityWrapper = requireNativeComponent(
    'RNAccessibilityWrapper'
) as React.ComponentClass<any>

interface AccessibilityWrapperProps extends ViewProps {
    fieldsRefs?: React.RefObject<React.Component>[]
}

const AccessibilityWrapperPropTypes = {
    ...ViewPropTypes,
    fieldsRefs: PropTypes.arrayOf(PropTypes.shape({
        current: PropTypes.object
    }) as PropTypes.Validator<React.RefObject<React.Component>>)
}

class AccessibilityWrapperIOS extends React.Component<
    AccessibilityWrapperProps
> {
    public static propTypes = AccessibilityWrapperPropTypes

    private ref = React.createRef<React.Component<any>>()

    public componentDidMount() {
        if (this.props.fieldsRefs) {
            this.setAccessibilityFields(this.props.fieldsRefs.map(ref => ref.current))
        }
    }
    public componentDidUpdate() {
        if (this.props.fieldsRefs) {
            this.setAccessibilityFields(this.props.fieldsRefs.map(ref => ref.current))
        }
    }

    private setAccessibilityFields = (
        fields: (React.Component<any> | null)[]
    ) => {
        const fieldTags =
            fields && fields.map(component => component && findNodeHandle(component))
        return RNAccessibilityWrapperManager.setAccessibilityFields(
            findNodeHandle(this.ref.current),
            fieldTags
        )
    }

    public render() {
        return <RNAccessibilityWrapper {...this.props} ref={this.ref} />
    }
}

const AccessibilityWrapperAndroid: React.FunctionComponent<
    AccessibilityWrapperProps
> = ({ fieldsRefs, ...props }) => <View {...props} />
AccessibilityWrapperAndroid.propTypes = AccessibilityWrapperPropTypes

/**
 * The AccessibilityWrapper component allows you to adjust the behaviour of the native platform
 * when it comes to accessibility. Using this component you can tell the native platform to
 * group all subviews together for accessibility purposes (since it's not always done by
 * default), and you can even override the focus order of subviews
 *
 * @example
 *  export default class App extends Component<{}> {
 *    fooRef = React.createRef<Text>();
 *    barRef = React.createRef<Text>();
 *    bazRef = React.createRef<Text>();
 *
 *    public render() {
 *      return (
 *        <AccessibilityWrapper fieldsRefs={[
 *          this.barRef,
 *          this.fooRef,
 *          this.bazRef,
 *        ]}>
 *          <SafeAreaView>
 *            <Text ref={this.fooRef}>Foo</Text>
 *            <Text ref={this.barRef}>Bar</Text>
 *            <Text ref={this.bazRef}>Baz</Text>
 *          </SafeAreaView>
 *        </AccessibilityWrapper>
 *      );
 *    }
 *  }
 */
export default Platform.select<React.ComponentType<AccessibilityWrapperProps>>({
    ios: AccessibilityWrapperIOS as React.ComponentType<
        AccessibilityWrapperProps
    >,
    android: AccessibilityWrapperAndroid as React.ComponentType<
        AccessibilityWrapperProps
    >
})