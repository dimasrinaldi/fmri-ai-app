import type { UploadFile } from 'antd';
import _ from "lodash";
import { TRunningDistanceId } from '~/data/data.running-distance';
import { useAuthStore } from '~/root/auth/store';
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilProcessUploadedFile } from "~/util/util.process-uploaded-file";
import { utilZodErrFromStr } from '~/util/util.zod-err-from-str';
import { useAppStore } from '../_app/store';

type TDistanceVar = {
    id: TRunningDistanceId;
    color: string;
    km: number;
    startedAt: string;
}

const storeUtil = utilCreateWidget({
    name: "ShoeDetectionRecognizing",
    useInitStore: (opt) => {
        const app = useAppStore();
        const state = opt.useMobState(() => ({
            page: 0,
            onDuplicate: "skip" as "skip" | "replace",
            search: "",
            isEdit: false,

            eventName: "",
            distanceVars: [] as TDistanceVar[],

        }));

        const state1 = useMobState(() => ({
            fileList: [] as UploadFile[],
            isSubmiting: false,
            formErrMsg: "",
        }))

        const store = useCraftStore(() => ({
            get clientId() { return app.activeClient.id },
            get limit() { return 1 },
            get offset() { return store.page * store.limit },
            get items() { return ext.list.data.items },
            get count() { return ext.list.data.count },
            get isListLoading() { return !ext.list.isFetched },
            get recItems() { return ext.list.data.recItems },
            get isFilledSomeForm() {
                return store.eventName.length > 0
                    || store.inputDistanceVars.length > 0
            },
            get isReadyTobeSubmitted() {
                return store.eventName.length > 0
                    && store.inputDistanceVars.every((item) => item.isReady)
                    && store.fileList.length > 0
            },
            get inputDistanceVars() {
                return state.distanceVars.map((item) => {
                    const isSome = item.color.length > 0 || item.km > 0 || item.startedAt.length > 0;
                    const isReady = item.color.length > 0 && item.km > 0 && item.startedAt.length > 0;
                    let result = { ...item, isSome, isReady }
                    return result;
                })
            }, get formErr() {
                const result = utilZodErrFromStr(store.formErrMsg, [
                    "eventName", "distanceVars"
                ]);
                return result;
            },
            onChangeDistanceCheckbox(distances: TRunningDistanceId[]) {
                const oldDistanceVars = _.cloneDeep(store.distanceVars).filter(i => distances.includes(i.id));
                const distanceVars = distances.map(i => {
                    const rd = oldDistanceVars.find((j) => j.id == i)
                    const result: TDistanceVar = {
                        id: i,
                        color: rd?.color ?? "",
                        km: rd?.km ?? 0,
                        startedAt: rd?.startedAt ?? ""
                    }
                    return result
                })
                state.setState({ distanceVars })
            },
            onResetInputs() {
                state1.setState({
                    formErrMsg: ""
                })
                state.setState({
                    eventName: "",
                    distanceVars: []
                })
            },
            onSetPagination(page: number, limit: number) {
                state.setState({ page });
            },
            onSetSearch(search: string) {
                state.setState({ search, page: 0 });
            },
            get isRecognizing() { return ext.recognizing.isPending || store.isSubmiting },
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            setIsSubmitting(value: boolean) {
                state1.setState({ isSubmiting: value })
            }, setFileList(fileList: UploadFile[]) {
                state1.setState({ fileList })
            }, onStopSubmitting() {
                ext.recognizing.reset();
                state1.setState({ isSubmiting: false })
            }, async onSubmit() {
                if (store.fileList.length == 0) return;
                store.setIsSubmitting(true);
                const base64Url = await utilProcessUploadedFile(store.fileList[0].originFileObj as any, "base64");
                const distanceVars = _.cloneDeep(store.distanceVars)
                ext.recognizing.mutateAsync({
                    clientId: store.clientId,
                    base64Url,
                    fileName: store.fileList[0].name,
                    onDuplicate: store.onDuplicate,

                    eventName: store.eventName,
                    distanceVars
                }, {
                    onSuccess: () => {
                        let newFiles = _.cloneDeep(store.fileList).slice(1);
                        store.setFileList(newFiles);
                        ext.list.refetch();
                        ext.recognizing.reset()
                        state1.setState({ formErrMsg: "" })
                        if (
                            newFiles.length <= 0 ||
                            !store.isSubmiting
                        ) {
                            store.setIsSubmitting(false)
                            return;
                        }
                        store.onSubmit()
                    },
                })
            }, onToggleDuplicateMode() {
                state.setState({ onDuplicate: store.onDuplicate == "skip" ? "replace" : "skip" })
            }, onToggleIsEdit() {
                state.setState({ isEdit: !store.isEdit })
            },
            onSetDistanceVar(id: TRunningDistanceId, type: "color" | "km" | "startedAt", value: string) {
                const distanceVars = store.inputDistanceVars.map((item) => {
                    let result = _.clone(item);
                    if (item.id == id) {
                        if (["km"].includes(type)) {
                            (result as any)[type] = parseFloat(value)
                        } else {
                            (result as any)[type] = value;
                        }
                    }
                    return result;
                })
                state.setState({ distanceVars })
            }
        }), () => [
            utilOmit(state, "setState"),
            utilOmit(state1, "setState"),
        ]);

        const ext = useToMobExt({
            recognizing: trpcUse.shoeDetectionRecognizing.useMutation({
                onError: ({ message }) => {
                    state1.setState({
                        isSubmiting: false,
                        formErrMsg: message
                    })
                    ext.recognizing.reset()
                }
            }),
            list: trpcUse.shoeDetectionRecognizingList.useQuery({
                clientId: store.clientId,
                search: store.search,
                sortBy: "createdAt",
                sortDirection: "desc",
                limit: store.limit,
                offset: store.offset,
            }, {
                initialData: {
                    items: [],
                    count: 0,
                    recItems: []
                },
            }),
        });

        return store;
    },
    useAuthCheckAccess() {
        return {
            accessState: useAuthStore().checkAccess(["Feature_Privileged"]),
            forbiddenType: "Page"
        }
    },
});

export const hocShoeDetectionRecognizing = storeUtil.hocComp;
export const useShoeDetectionRecognizingStore = storeUtil.useStore;
