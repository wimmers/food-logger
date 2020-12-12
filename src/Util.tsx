import { useRef, useState } from "react";

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