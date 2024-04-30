import React, {Component} from 'react';
import {ErrorDetails} from './ErrorDetails';
import crashlytics from '@react-native-firebase/crashlytics';

/**
 * This component handles whenever the user encounters a JS error in the
 * app. It follows the "error boundary" pattern in React. We're using a
 * class component because according to the documentation, only class
 * components can be error boundaries.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Error-Boundary.md)
 * - [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
 */
export class ErrorBoundary extends Component {
  state = {error: null, errorInfo: null};

  // If an error in a child is encountered, this will run
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    crashlytics().recordError(error);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log error messages to an error reporting service here
    // This is a great place to put BugSnag, Sentry, crashlytics, etc:
    // reportCrash(error)
  }

  // Reset the error back to null
  resetError = () => {
    this.setState({error: null, errorInfo: null});
  };

  // To avoid unnecessary re-renders
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.error !== nextProps.error;
  }

  // Only enable if we're catching errors in the right environment
  isEnabled() {
    return (
      this.props.catchErrors === 'always' ||
      (this.props.catchErrors === 'dev' && __DEV__) ||
      (this.props.catchErrors === 'prod' && !__DEV__)
    );
  }

  // Render an error UI if there's an error; otherwise, render children
  render() {
    return !__DEV__ && this.state.error ? (
      <ErrorDetails
        onReset={this.resetError}
        error={this.state.error}
        errorInfo={this.state.errorInfo}
      />
    ) : (
      this.props.children
    );
  }
}
