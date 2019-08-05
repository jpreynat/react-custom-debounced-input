import * as React from 'react';
import {
    defaultComponentRefProp,
    defaultOnBeforeChange,
    defaultOnBlur,
    defaultOnKeyDown
} from './defaults';
import { DebouncedProps } from './types';
import { useDebouncedInput } from './useDebouncedInput';

/*
 * Input that triggers a onChange event only when blur or pressing enter
 */
function CustomDebouncedInput(
    props: DebouncedProps & {
        // Rendered component, defaults to <input />
        component?: React.ComponentType;
        // Any other props passed to the rendered component
        [prop: string]: any;
    },
    ref: React.Ref<unknown>
): React.ReactElement {
    // Extract and default props
    const {
        value: valueProps,
        onChange: onChangeProps,
        component: InputComponent = 'input',
        componentRefProp = defaultComponentRefProp,
        onBeforeChange = defaultOnBeforeChange,
        onKeyDown: onKeyDownProps = defaultOnKeyDown,
        onBlur: onBlurProps = defaultOnBlur,
        ...otherProps
    } = props;

    // Setup ref and imperative API
    const inputRef = React.useRef<any>(null);
    const focus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const blur = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };
    const select = () => {
        if (inputRef.current) {
            inputRef.current.select();
        }
    };

    React.useImperativeHandle(ref, () => ({
        focus,
        blur,
        select
    }));

    const debouncedProps = useDebouncedInput({
        value: valueProps,
        onChange: onChangeProps,
        onBeforeChange,
        onBlur: onBlurProps,
        onKeyDown: onKeyDownProps,
        ref: inputRef
    });

    // Assign ref to the rendered component
    const componentProps = {
        [componentRefProp]: inputRef,
        ...debouncedProps,
        ...otherProps
    };

    return <InputComponent {...componentProps} />;
}

export const DebouncedInput = React.forwardRef(CustomDebouncedInput);
