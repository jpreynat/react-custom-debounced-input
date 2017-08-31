/* @flow */

import React from 'react';

/*
 * Input that trigger a onChange event only when blur or pressing enter
 */

type DebouncedInputProps = {
    // Forwarded to <component> as the <value> prop
    value: string,
    // Debounced callback when input is blurred or on pressing Enter
    onChange: (value: string) => *,
    // Rendered React$Element, defaults to <input />
    component: Class<React$Component<*, *, *>> | string,
    // Optional modifier for <value> before <onChange> is called
    onBeforeChange: (string | SyntheticInputEvent) => string,
    // The component listens to onKeyDown and thus needs to explicitly call user's listener
    onKeyDown: (event: Event) => void,
    // Callback when content is blurred
    onBlur?: () => *
};

type DebouncedInputState = {
    value: string
};

class DebouncedInput extends React.Component {
    input: *;

    props: DebouncedInputProps;
    state: DebouncedInputState;

    static defaultProps = {
        onBeforeChange: update =>
            typeof update == 'string' ? update : update.target.value,
        component: 'input',
        onKeyDown: () => {},
        onBlur: () => {}
    };

    constructor(props: DebouncedInputProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    componentWillReceiveProps(newProps: DebouncedInputProps) {
        // If we have change that have not been blurred already,
        // we keep our current value
        if (this.props.value == newProps.value) {
            return;
        }

        this.setState({
            value: newProps.value
        });
    }

    // Imperative API
    focus() {
        this.input.focus();
    }
    blur() {
        this.input.blur();
    }
    select() {
        this.input.select();
    }

    /*
     * Signal a new value if different from current set one.
     */
    dispatchChange = () => {
        const { onChange, value: initialValue } = this.props;
        const { value } = this.state;

        if (value == initialValue) {
            return;
        }

        // It requires some hacking in case that the parent "onChange"
        // reset the value to the initial value (ex: when the value is set to an empty string)
        // the component is not re-render by its parent, and we need to schedule a reset ourselves

        onChange(value);

        this.setState(state => {
            if (this.props.value == initialValue) {
                return {
                    value: initialValue
                };
            }

            return state;
        });
    };

    onChange = (update: string | SyntheticInputEvent) => {
        const { onBeforeChange } = this.props;
        const value = onBeforeChange(update);

        this.setState({
            value
        });
    };

    onBlur = (event: Event) => {
        const { onBlur } = this.props;
        this.dispatchChange();

        if (onBlur) {
            onBlur();
        }
    };

    onKeyDown = (event: Event) => {
        const { onKeyDown } = this.props;
        onKeyDown(event);

        if (event.defaultPrevented) {
            return;
        }

        // We blur, if we press Enter or Escape
        if (event.keyCode === 27 || event.keyCode === 13) {
            this.blur();
        }
    };

    render() {
        const { value } = this.state;
        const { component: InputComponent, ...props } = this.props;
        delete props.onBeforeChange;

        return (
            <InputComponent
                {...props}
                ref={el => {
                    this.input = el;
                }}
                value={value}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onKeyDown={this.onKeyDown}
            />
        );
    }
}

export default DebouncedInput;
