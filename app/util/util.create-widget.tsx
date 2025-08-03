import { KeyOutlined, LockFilled } from "@ant-design/icons";
import { Button, Flex, Result, ResultProps, theme } from "antd";
import _ from "lodash";
import { observer } from "mobx-react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useQurlStore } from "~/provider/provider.qurl";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobStateStorage } from "~/use/use.mob-state-storage";
import { useToMobExt } from "~/use/use.to-mob-ext";
import ErrorBoundary500 from "~/view/view.error-boundary-500";
import { utilHasWindow } from "./util.has-window";
import { utilLogMoStore } from "./util.log-mo-store";

export function utilCreateWidget<
    TMyStore extends object,
    TProps extends object,
    TInitOptions extends {
        widgetId: string
        useMobState: <TState extends Record<string, any>>(fnInit: () => TState) => TState & {
            setState(partialState: Partial<TState>): void;
        }
    }
>(args: {
    name: string,
    useInitStore: (options: TInitOptions, props: TProps) => TMyStore,
    useAuthCheckAccess?: () => ({
        accessState: "Ok" | "Forbidden" | "Unauthorized" | "Hidden",
        forbiddenType?: "Page" | "Widget"
    })
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

            const key = (props as any)?.key ?? "0";
            const storeKey = `${_.kebabCase(args.name)}-${key}`;
            const store = args.useInitStore({
                widgetId: storeKey,
                useMobState: (fn) => {
                    return useMobStateStorage(storeKey, fn)
                    // return useMobState(fn)
                }
            } as TInitOptions, props);

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

        const MyComp = observer((props: TProps) => {
            const qurl = useQurlStore();

            const [isReady, setIsReady] = useState(false)
            useEffect(() => {
                if (!qurl.getIsPathSync()) return;
                setIsReady(true)
            }, [qurl.pathname])

            const myAccess = args.useAuthCheckAccess?.()
            const accessType = myAccess?.accessState ?? "Ok";
            const forbiddenType = myAccess?.forbiddenType ?? "Widget";
            if (accessType == "Hidden" || !isReady) return <></>;
            if (accessType == "Ok") return <StoreComp {...props as any} />;
            if (forbiddenType === "Page")
                return <ViewUnauthorizedPage accessType={accessType} />
            return ""
        });

        return MyComp;
    };

    return {
        hocComp,
        useStore: useMyStore,
    };
}

type TViewUnauthorizedPage = ResultProps & {
    accessType: "Forbidden" | "Unauthorized";
};

const ViewUnauthorizedPage = observer((_props: TViewUnauthorizedPage) => {
    const props = useToMobExt(_props);
    const qurl = useQurlStore();
    // const env = usePublicEnv()
    const store = useCraftStore(() => ({
        onRedirect() {
            // const path = env.loginPath;
            // qurl.set({ path });
        },
    }));
    const { token } = theme.useToken()

    return (
        <Flex align="center" justify="center" style={{
            backgroundColor: token.colorBgBase,
            height: "100vh"
        }}>
            {props.accessType == "Unauthorized" ? <Result
                icon={<KeyOutlined />}
                title="Unauthorized"
                subTitle="Please log in first to gain access."
                extra={
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => store.onRedirect()}
                    >
                        Log in
                    </Button>
                }
            /> : <Result
                icon={<LockFilled />}
                title="Forbidden"
                subTitle="Sorry, you are Forbidden to access this page."
            />}
        </Flex>
    );
});
