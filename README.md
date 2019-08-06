# `react-custom-debounced-input`


[![Build Status](https://travis-ci.org/jpreynat/react-custom-debounced-input.svg?branch=master)](https://travis-ci.org/jpreynat/react-custom-debounced-input)
[![NPM version](https://badge.fury.io/js/react-custom-debounced-input.svg)](http://badge.fury.io/js/react-custom-debounced-input)

React hook to debounce a custom input component's `onChange` method.
Also provides a wrapper component if hooks cannot be used.

### Installation

```bash
$ npm install react-custom-debounced-input --save
# or
$ yarn add react-custom-debounced-input
```

### Hook API

```tsx
import * as React from 'react';
import { useDebouncedInput } from 'react-custom-debounced-input';

function UppercaseDebouncedInput(): React.ReactElement {
    // The debounced value
    const [value, setValue] = React.useState('');

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    // Focus the input on initial mount
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Actually do something with the value when the input is blurred
    // or when enter or escaped is pressed
    const onChange = (value: string) => {
        this.setState({ value });
    };

    // Optional modifier for value
    const onBeforeChange = (value: string) => {
        return value.toUpperCase();
    };

    // Get the props to pass to the <input /> component
    const debouncedProps = useDebouncedInput({
        value,
        onChange,
        onBeforeChange,
        ref: inputRef
    });

    return (
        <input {...debouncedProps} />
    );
}
```

### Component API

```ts
interface DebouncedInputProps {
    // Forwarded to <component> as the <value> prop
    value: string;
    // Rendered component, defaults to <input />
    component?: React.ComponentType;
    // Debounced callback when input is blurred or on pressing Enter
    onChange: (value: string) => void;
    // Optional modifier for <value> before <onChange> is called
    onBeforeChange?: (update: any) => string;
    // Callback when content is blurred
    onBlur?: (event: React.FocusEvent) => void;
    // Optional event preventDefaulter for the onKeyDown event
    onKeyDown?: (event: React.KeyboardEvent) => void;
    // Key of the ref callback prop. Defaults to 'ref'. Some components use
    // other conventions like 'inputRef', etc...
    componentRefProp?: string;
    // Any other props passed to the rendered component
    [prop: string]: any;
}
```

### Usage

```tsx
import * as React from 'react';
import { DebouncedInput } from 'react-custom-debounced-input';

class UppercaseDebouncedInput extends React.Component {
    // The debounced value
    state: {
        value: string
    } = {
        value: ''
    };

    // Actually do something with the value when the input is blurred
    // or when enter or escaped is pressed
    onChange = (value: string) => {
        this.setState({ value });
    };

    // Optional modifier for value
    onBeforeChange = (value: string) => {
        return value.toUpperCase();
    };

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
