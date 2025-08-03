import { useEffect } from "react";
import { dataApp, TAppId } from "~/data/data.app";
import { TItemStatusId } from "~/data/data.item-status";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilZodErrFromStr } from "~/util/util.zod-err-from-str";

const storeUtil = utilCreateWidget({
    name: "AdminClientListIdEdit",
    useInitStore: () => {
        const qurl = useQurlStore();
        const trpcUtils = trpcUse.useUtils();

        const state = useMobState(() => ({
            name: "",
            status: "Active" as TItemStatusId,
            apps: [] as TAppId[],
            formErrStr: "",
        }));

        const store = useCraftStore(() => ({
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            get id() { return qurl.pathVal(2, "") },
            get isEdit() { return store.id != "new" },
            get isSubmitLoading() { return ext.edit.isPending },
            get formErr() {
                return utilZodErrFromStr(store.formErrStr, [
                    "name", "status", "apps"
                ]);
            },
            get appOptions() {
                return dataApp.map((i) => ({ value: i.id, label: i.label }));
            },
            get oneIsError() { return ext.one.isError },
            get oneIsLoading() { return ext.one.isFetching },
            onSubmit() {
                if (!store.isEdit) {
                    ext.create.mutate({
                        name: store.name,
                        apps: store.apps,
                    });
                } else {
                    ext.edit.mutate({
                        id: store.id,
                        name: store.name,
                        status: store.status,
                        apps: store.apps,
                    });
                }

            },
            onClose() {
                qurl.set(`/admin/client-list`);
                trpcUtils.adminClientList.refetch();
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);
        console.log(store.id, "dfdf---")

        const ext = useToMobExt({
            one: trpcUse.adminClientListIdEditOne.useQuery({
                id: store.id,
            }, {
                enabled: store.isEdit,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                initialData: {
                    item: {
                        name: "",
                        status: "Active",
                        apps: []
                    },
                },
            }),
            edit: trpcUse.adminClientListIdEdit.useMutation({
                onSuccess: () => {
                    store.onClose();
                },
                onError: ({ message }) => {
                    store.setState({ formErrStr: message });
                },
            }),
            create: trpcUse.adminClientListIdEditCreate.useMutation({
                onSuccess: () => {
                    store.onClose();
                },
                onError: ({ message }) => {
                    store.setState({ formErrStr: message });
                },
            }),
        });

        useEffect(() => {
            store.setState({ ...ext.one.data.item });
        }, [ext.one.isFetching])

        return store;
    },
});

export const hocAdminClientListIdEdit = storeUtil.hocComp;
export const useAdminClientListIdEditStore = storeUtil.useStore;
