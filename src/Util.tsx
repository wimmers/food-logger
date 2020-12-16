import React from "react";

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