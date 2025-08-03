import _ from "lodash";
import { TAclId } from "~/data/data.acl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import usePublicEnv from "~/use/use.publicEnv";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCanAccess } from "~/util/util.can-access";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilPublicEnv } from "~/util/util.public-env";

type IProps = {
    children: React.ReactNode;
}
const storeUtil = utilCreateWidget({
    name: "Auth",
    useInitStore: (__, ___: IProps) => {
        const env = usePublicEnv()
        const store = useCraftStore(() => ({
            get profile() { return ext.profile.data },
            get isAuthorized() { return !store.profile.isGuest },
            get isApiInitFetched() { return ext.isApiInitFetched },
            canAccess(features: TAclId[] = []) {
                return utilCanAccess({
                    features,
                    acl: store.profile.acl ?? [],
                });
            },
            checkAccess(features: TAclId[] = []) {
                let result: "Ok" | "Forbidden" | "Unauthorized" = "Ok"
                const isCanAccess = utilCanAccess({
                    features,
                    acl: store.profile.acl ?? [],
                });
                if (!store.isAuthorized) result = "Unauthorized";
                else if (!isCanAccess) result = "Forbidden";
                return result;
            },
            onLogout() {
                ext.logout.mutate(undefined, {
                    onSuccess: () => {
                        const path = env.loginPath;
                        window.location.href = path;
                        sessionStorage.clear();
                    },
                });
            },
        }));

        const ext = useToMobExt({
            profile: trpcUse.authProfile.useQuery(undefined, {
                initialData: {
                    id: "",
                    name: "",
                    username: "",
                    clientId: "",
                    clientName: "",
                    clientApps: [],
                    roleId: "",
                    roleName: "",
                    acl: [],
                    isGuest: true,
                },
            }),
            logout: trpcUse.authLogout.useMutation(),
        });
        store.profile.clientName
        return store;
    }
});

export const hocAuth = storeUtil.hocComp;
export const useAuthStore = storeUtil.useStore;
