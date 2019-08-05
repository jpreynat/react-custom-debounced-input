import * as React from 'react';

function defaultOnBeforeChange(
    update: string | React.ChangeEvent<any>
): string {
    if (typeof update === 'string') {
        return update;
    } else {
        return update.currentTarget.value;
    }
}

function defaultOnKeyDown(event: React.KeyboardEvent) {
    return;
}

function defaultOnBlur(event: React.FocusEvent) {
    return;
}

export function useDebouncedInput(props: {
    value: string;
    onChange: (value: string) => void;
    onBeforeChange?: (update: string | React.ChangeEvent<any>) => string;
    onBlur?: (event: React.FocusEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    ref: React.Ref<{ blur(): void }>;
}) {
    const {
        value: valueProps,
        onChange: onChangeProps,
        onBeforeChange = defaultOnBeforeChange,
        onBlur: onBlurProps = defaultOnBlur,
        onKeyDown: onKeyDownProps = defaultOnKeyDown,
        ref
    } = props;

    // Actually used value in child component
    const [value, setValue] = React.useState(valueProps);
    React.useEffect(() => {
        if (valueProps !== value) {
            setValue(valueProps);
        }
    }, [valueProps]);

    /*
     * Signal a new value if different from current one.
     */
    const dispatchChange = () => {
        if (value === valueProps) {
            return;
        }

        onChangeProps(value);
    };

    const onChange = (update: string | React.ChangeEvent<any>) => {
        setValue(onBeforeChange(update));
    };

    const onBlur = (event: React.FocusEvent) => {
        onBlurProps(event);
        if (event.defaultPrevented) {
            return;
        }

        dispatchChange();
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        onKeyDownProps(event);
        if (event.defaultPrevented) {
            return;
        }

        // We blur, if we press Enter or Escape
        if (event.keyCode === 27 || event.keyCode === 13) {
            if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.blur();
            }
        }
    };

    return {
        value,
        onChange,
        onBlur,
        onKeyDown
    };
}

/*
 * Input that triggers a onChange event only when blur or pressing enter
 */
function CustomDebouncedInput(
    props: {
        // Forwarded to <component> as the <value> prop
        value: string;
        // Debounced callback when input is blurred or on pressing Enter
        onChange: (value: string) => void;
        // Rendered React$Element, defaults to <input />
        component?: React.ComponentType;
        // Key of the ref callback prop. Defaults to 'ref'. Some components use
        // other conventions like 'inputRef', etc...
        componentRefProp?: string;
        // Optional modifier for <value> before <onChange> is called
        onBeforeChange?: (update: string | React.ChangeEvent<any>) => string;
        // The component listens to onKeyDown and thus needs to explicitly call user's listener
        onKeyDown?: (event: React.KeyboardEvent) => void;
        // Callback when content is blurred
        onBlur?: (event: React.FocusEvent) => void;
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
        componentRefProp = 'ref',
        onBeforeChange = defaultOnBeforeChange,
        onKeyDown: onKeyDownProps = defaultOnKeyDown,
        onBlur: onBlurProps = defaultOnBlur,
        ...otherProps
    } = props;

    // Setup ref and imperative API
    const inputRef = React.useRef<any>();

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
