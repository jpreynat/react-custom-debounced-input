/*
 * Default onBeforeChange method
 * It handles a basic string value and a React.ChangeEvent event
 */
export function defaultOnBeforeChange(update: any): string {
    if (typeof update === 'string') {
        return update;
    } else {
        return update.currentTarget.value;
    }
}

/*
 * Default onKeyDown method
 * No-op
 */
export function defaultOnKeyDown(event: React.KeyboardEvent) {
    return;
}

/*
 * Default onBlur method
 * No-op
 */
export function defaultOnBlur(event: React.FocusEvent) {
    return;
}

/*
 * Default componentRefProp
 */
export const defaultComponentRefProp = 'ref';
