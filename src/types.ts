export interface DebouncedProps {
    // Forwarded to <component> as the <value> prop
    value: string;
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
}
