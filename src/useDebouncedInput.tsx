import * as React from 'react';
import {
    defaultComponentRefProp,
    defaultOnBeforeChange,
    defaultOnBlur,
    defaultOnKeyDown
} from './defaults';
import { DebouncedProps } from './types';

interface Blurable {
    blur(): void;
}

/*
 * Returns the set of props to pass to the controlled component
 */
export function useDebouncedInput(
    props: DebouncedProps & {
        // Ref passed to the debounced component
        // It cannot be a callback ref, since we couldn't "hack" it
        ref: React.MutableRefObject<Blurable> | React.RefObject<Blurable>;
    }
) {
    const {
        value: valueProps,
        onChange: onChangeProps,
        onBeforeChange = defaultOnBeforeChange,
        onBlur: onBlurProps = defaultOnBlur,
        onKeyDown: onKeyDownProps = defaultOnKeyDown,
        componentRefProp = defaultComponentRefProp,
        ref
    } = props;

    // Warning in case a callback ref was passed in props
    if (typeof ref === 'function') {
        // tslint:disable-next-line:no-console
        console.error(
            'useDebouncedInput: Passed a callback ref as the ref prop. Keys event will not be handled correctly.'
        );
    }

    // Actually used value in child component
    const [value, setValue] = React.useState(valueProps);
    React.useEffect(() => {
        if (valueProps !== value) {
            setValue(valueProps);
        }
    }, [valueProps]);

    /*
     * Actually propagate the update to the caller's onChange
     */
    const dispatchChange = () => {
        if (value === valueProps) {
            return;
        }

        onChangeProps(value);
    };

    /*
     * Update the value in the controlled component
     */
    const onChange = (update: any) => {
        setValue(onBeforeChange(update));
    };

    /*
     * Propagate the update on blur, unless the passed <onBlur> prop prevents it
     */
    const onBlur = (event: React.FocusEvent<any>) => {
        onBlurProps(event);
        if (event.defaultPrevented) {
            return;
        }

        dispatchChange();
    };

    /*
     * Propagate the update on enter or escape, unless the passed <onKeyDown> prop prevents it
     */
    const onKeyDown = (event: React.KeyboardEvent<any>) => {
        onKeyDownProps(event);
        if (event.defaultPrevented) {
            return;
        }

        // We blur, if we press Enter or Escape
        if (event.keyCode === 27 || event.keyCode === 13) {
            if (ref && ref.current) {
                ref.current.blur();
            }
        }
    };

    /*
     * Return the props to pass to the controlled component
     */
    return {
        value,
        onChange,
        onBlur,
        onKeyDown,
        [componentRefProp]: ref
    };
}
