import _ from "lodash";
import { useUpdateEffect } from "react-use";
import { isValid } from "ulidx";
import { TAppId } from "~/data/data.app";
import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "App",
    useInitStore: (opt) => {
        const auth = useAuthStore();
        const qurl = useQurlStore();

        const state = opt.useMobState(() => ({
            isModalOpen: false,
            aiData: {} as Record<string, {
                title: string,
                active: boolean,
                data: any
            }>,
            isMainLayout: false,

            activeClientId: "",
        }))

        const store = useCraftStore(() => ({
            get access() {
                return {
                    featAdmin: auth.canAccess(["Admin_View"]),
                    levelSuper: auth.canAccess(["Scope_Super"]),
                }
            },
            get isFetchedClient() {
                return ext.clients.isFetched || ext.clients.data.clients.length > 0
            },
            get activeClient() {
                let client = ext.clients.data.clients.find(i => i.id == state.activeClientId);
                if (!client) {
                    client = {
                        id: auth.profile.clientId,
                        name: auth.profile.clientName,
                        apps: auth.profile.clientApps,
                    };
                }
                return client;
            },
            get profileName() { return auth.profile.name },
            get redirectTo() { return "/login" },
            get pathname() { return qurl.pathname },
            get clientOptions() {
                let result = ext.clients.data.clients.map(i => ({
                    label: i.name,
                    value: i.id,
                }))
                result = [...result, {
                    value: auth.profile.clientId,
                    label: auth.profile.clientName,
                }]
                result = _.uniqBy(result, i => i.value);
                return result;
            },
            onLogout() {
                auth.onLogout();
            }, onToPage(path: string) {
                qurl.set({ path });
            }, onClearSavedState() {
                sessionStorage.clear();
                window.location.reload();
            }, selectClientId(value: string) {
                qurl.set({ path: `/home` });
                state.setState({ activeClientId: value });
            },
            get subId() {
                return qurl.pathVal(1, "");
            },
            get subPath() {
                const enumResult = ["none", "survey"] as const;
                let result = "none"
                const subName = qurl.pathVal(0, "none");
                if (isValid(store.subId) && enumResult.includes(subName as any)) {
                    result = subName;
                }
                return result as typeof enumResult[number];
            },
            get activeAiData() { return Object.values(store.aiData).filter(i => i.active) },
            get isShowAi() {
                return store.activeAiData.length > 0
            },
            get qurl() { return qurl },
            addAiData(key: string, value: { title: string, active: boolean, data: any }) {
                let aiData = _.cloneDeep(store.aiData);
                if (value.active) {
                    aiData[key] = value;
                } else {
                    delete aiData[key];
                }
                state.setState({ aiData })
            },
            setAiModal(value: boolean) {
                state.setState({ isModalOpen: value });
            }, clearAiData() {
                state.setState({ aiData: {} })
            }, setIsMainLayout(value: boolean) {
                state.setState({ isMainLayout: value });
            }, hasAppAccess(appId: TAppId[]) {
                return store.activeClient.apps.length == 0 || store.activeClient.apps.some(i => appId.includes(i));
            },
        }),
            () => [
                utilOmit(state, "setState", "activeClientId"),
            ]
        );

        const ext = useToMobExt({
            clients: trpcUse.appClients.useQuery({
                includeClientIds: [auth.profile.clientId, state.activeClientId],
            }, {
                initialData: {
                    clients: [],
                }
            }),
        })
        useUpdateEffect(() => {
            store.clearAiData();
        }, [qurl.pathname])
        return store;
    },
    useAuthCheckAccess: () => ({
        accessState: useAuthStore().checkAccess(["All"]),
        forbiddenType: "Page"
    }),

});

export const hocApp = storeUtil.hocComp;
export const useAppStore = storeUtil.useStore;
