import React, { useRef, useState } from "react";

// This code is from https://www.robinwieruch.de/react-function-component
export function useAsyncReference<T>(value: T):
    [React.MutableRefObject<T>, (newState: T) => void] {
    const ref = useRef(value);
    const [, forceRender] = useState(false);

    function updateState(newState: T) {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }

    return [ref, updateState];
}

// From https://dev.to/alexkhismatulin/update-boolean-state-right-with-react-hooks-3k2i
export const useToggle = (initialState: boolean): [boolean, (() => void)] => {
    const [isToggled, setIsToggled] = React.useState(initialState);

    // put [setIsToggled] into the useCallback's dependencies array
    // this value never changes so the callback is not going to be ever re-created
    const toggle = React.useCallback(
        () => setIsToggled(state => !state),
        [setIsToggled],
    );

    return [isToggled, toggle];
}