import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";
import { useAppStore } from "../_app/store";
import { useQurlStore } from "~/provider/provider.qurl";
import { dataApp } from "~/data/data.app";
import { useRootStore } from "~/root/store";

const storeUtil = utilCreateWidget({
    name: "Home",
    useInitStore: () => {
        const qurl = useQurlStore();
        const root = useRootStore();
        const app = useAppStore();
        const store = useCraftStore(() => ({
            get publicEnv() { return root.publicEnv },
            get profileName() {
                return app.profileName;
            }, get activeFeatures() {
                return app.activeClient.apps.length === 0 ?
                    dataApp.map((item) => item.id) :
                    app.activeClient.apps
            },
            goToPage(path: string) {
                qurl.set(path)
            }
        }));
        return store;
    },
});

export const hocHome = storeUtil.hocComp;
export const useHomeStore = storeUtil.useStore;
