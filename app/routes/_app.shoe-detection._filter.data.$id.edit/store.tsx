import { useEffect } from "react";
import { useMount } from "react-use";
import { getDataCatMinuteKm } from "~/data/data.cat-minute-km";
import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilZodErrFromStr } from "~/util/util.zod-err-from-str";

const keyForms = ["brand", "model", "color", "gender", "podium", "event", "distance", "minuteKm", "runningNum"] as const;
type TKeyFormId = typeof keyForms[number];
const storeUtil = utilCreateWidget({
    name: "ShoeDetectionDataIdEdit",
    useInitStore: () => {
        const qurl = useQurlStore();
        const trpcUtils = trpcUse.useUtils();

        const state = useMobState(() => ({
            brand: "",
            model: "",
            color: "",
            gender: "",
            podium: "NO",
            event: "",
            distance: "",
            minuteKm: getDataCatMinuteKm("Unknown").label,
            runningNum: "",

            formErrStr: "",
        }));

        const store = useCraftStore(() => ({
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            get imageUrl() { return ext.one.data?.item.imageUrl },
            get id() { return qurl.pathVal(2, "") },
            get isSubmitLoading() { return ext.edit.isPending },
            get isDeleteLoading() { return ext.delete.isPending },
            get formErr() {
                return utilZodErrFromStr(store.formErrStr, keyForms);
            },
            get isEdit() { return store.id.length > 0 },
            get keyForms() { return keyForms },
            get oneIsLoading() { return ext.one.isFetching },
            get oneIsError() { return ext.one.isError },
            onSubmit() {
                ext.edit.mutate({
                    id: store.id,
                    brand: store.brand.trim().toUpperCase(),
                    model: store.model.trim().toUpperCase(),
                    color: store.color.trim().toUpperCase(),
                    podium: store.podium as any,
                    event: store.event.trim().toUpperCase(),
                    gender: store.gender as any,
                    distance: store.distance as any,
                    minuteKm: store.minuteKm as any,
                    runningNum: store.runningNum.trim().toUpperCase(),
                });
            },
            onClose() {
                qurl.set(`/shoe-detection/data`);
                trpcUtils.shoeDetectionDataList.refetch();
            }, onSetFormValue(key: TKeyFormId, value: string) {
                store.setState({ [key]: value.toUpperCase() });
            }, onDelete() {
                ext.delete.mutate({
                    id: store.id,
                })
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            one: trpcUse.shoeDetectionDataIdEditOne.useQuery({
                id: store.id,
            }, {
                enabled: store.isEdit,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            }),
            edit: trpcUse.shoeDetectionDataIdEdit.useMutation({
                onSuccess: () => {
                    store.onClose();
                },
                onError: ({ message }) => {
                    store.setState({ formErrStr: message });
                },
            }),
            delete: trpcUse.shoeDetectionDataIdDelete.useMutation({
                onSuccess: () => {
                    store.onClose();
                },
            }),
        });

        useEffect(() => {
            if (typeof ext.one.data?.item == "undefined") return
            store.setState({ ...ext.one.data.item });
        }, [ext.one.isFetching])

        return store;
    },
    useAuthCheckAccess: () => {
        return {
            accessState: useAuthStore().checkAccess(["Feature_Privileged"])
        }
    },

});

export const hocShoeDetectionDataIdEdit = storeUtil.hocComp;
export const useShoeDetectionDataIdEditStore = storeUtil.useStore;
