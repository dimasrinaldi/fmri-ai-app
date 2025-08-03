import { ReactNode } from "react";
import { useUpdateEffect } from "react-use";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilPublicEnv } from "~/util/util.public-env";
import { utilWindow } from "~/util/util.window";

type IProps = {
    children: ReactNode;
};
const storeUtil = utilCreateWidget({
    name: "Root",
    useInitStore: (__, ___: IProps) => {

        const store = useCraftStore(() => ({
            get publicEnv() { return ext.root.data },
            get buildId() { return ext.root.data.buildId },
            get isApiInitFetched() { return ext.isApiInitFetched },
            onReloadApp() {
                if (process.env.NODE_ENV != "production") return
                utilWindow().location.reload();
            }
        }));

        const ext = useToMobExt({
            root: trpcUse.root.useQuery(undefined, {
                initialData: utilPublicEnv(),
            }),
        });

        useUpdateEffect(() => {
            store.onReloadApp()
        }, [store.buildId]);

        return store;
    }
});

export const hocRoot = storeUtil.hocComp;
export const useRootStore = storeUtil.useStore;
