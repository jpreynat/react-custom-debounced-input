# `react-custom-debounced-input`


[![Build Status](https://travis-ci.org/jpreynat/react-custom-debounced-input.svg?branch=master)](https://travis-ci.org/jpreynat/react-custom-debounced-input)
[![NPM version](https://badge.fury.io/js/react-custom-debounced-input.svg)](http://badge.fury.io/js/react-custom-debounced-input)

React wrapper component for custom inputs components with debounced onChange event.

### Installation

```bash
$ npm install react-custom-debounced-input --save
# or
$ yarn add react-custom-debounced-input
```

### Component API

```js
type DebouncedInputProps = {
    // Forwarded to <component> as the <value> prop
    value: string,
    // Debounced callback when input is blurred or on pressing Enter
    onChange: (value: string) => *,
    // Rendered React$Element, defaults to <input />
    component?: React$Element<*>,
    // Optional modifier for <value> before <onChange> is called
    onBeforeChange?: (string | SyntheticInputEvent) => string
};
```

### Usage

```js
import React from 'react';
import DebouncedInput from 'react-custom-debounced-input';

class UppercaseDebouncedInput extends React.Component {
    /*
     * Component state
     */
    state: {
        value: string
    } = {
        value: ''
    };

    /*
     * Update your actual input value
     */
    onChange = (value: string) => {
        this.setState({ value });
    };

    /*
     * Optional modifier for value before onChange is called
     */
    onBeforeChange = (value: string) => {
        return value.toUpperCase();
    }

    render() {
        return (
            <DebouncedInput
                value={this.state.value}
                onChange={this.onChange}
                onBeforeChange={this.onBeforeChange}
            />
        );
    }
}
```
