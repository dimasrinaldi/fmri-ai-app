import { useSyncExternalStore } from "react";
import * as React from "react";

type Props = {
    children(): React.ReactNode;
    fallback?: React.ReactNode;
};
export function ViewClientOnly({ children, fallback=null }: Props): React.JSX.Element {
    return useHydrated() ? React.createElement(React.Fragment, null, children()) : React.createElement(React.Fragment, null, fallback);
}

function subscribe() {
    return () => {};
}
export function useHydrated() {
    return useSyncExternalStore(subscribe, () => true, () => false);
}
