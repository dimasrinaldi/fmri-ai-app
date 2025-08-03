import _ from "lodash";
import { observer } from "mobx-react";
import { ReactNode, createContext, useContext } from "react";
import ErrorBoundary500 from "~/view/view.error-boundary-500";
import { utilHasWindow } from "./util.has-window";
import { utilLogMoStore } from "./util.log-mo-store";

export function utilCreateProvider<
    TMyStore extends object,
    TProps = void,
>(args: {
    name: string,
    useInitStore: (props: TProps) => TMyStore,
}) {
    const Context = createContext<TMyStore | null>(null);
    const Provider = Context.Provider;

    const useMyStore = () => {
        const store = useContext(Context);
        if (!store) throw new Error("No Store " + args.name);
        return store;
    };

    const hocComp = (_Fn: (hocarg: { props: TProps, store: TMyStore }) => ReactNode) => {
        const Fn = observer(_Fn);
        const StoreComp = observer((props: TProps) => {

            const store = args.useInitStore(props);
            const key = (props as any)?.key ?? "0";
            const storeKey = `${_.kebabCase(args.name)}-${key}`;
            if (utilHasWindow()) utilLogMoStore(storeKey, store);

            return (
                <Provider value={store as any}>
                    <div className={`${_.kebabCase(args.name)}-widget`}>
                        <ErrorBoundary500>
                            <Fn store={store} props={props} />
                        </ErrorBoundary500>
                    </div>
                </Provider>
            );
        });
        return StoreComp;
    };

    const CompProvider = hocComp(({ props }) => {
        return <>{(props as any).children}</>;
    });

    return {
        useStore: useMyStore,
        Provider: CompProvider,
    };
}
