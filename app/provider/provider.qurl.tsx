import { useNavigate } from "@remix-run/react";
import _ from "lodash";
import { ReactNode } from "react";
import URLParse from "url-parse";
import { useCraftStore } from "~/use/use.craft-store";
import { useLoc } from "~/use/use.loc";
import { useMobState } from "~/use/use.mob-state";
import { utilCreateProvider } from "~/util/util.create-provider";
import { utilHasWindow } from "~/util/util.has-window";
import { utilObjValExist } from "~/util/util.obj-val-exist";
import { utilOmit } from "~/util/util.omit";
import { utilStrToHref } from "~/util/util.str-to-href";
import { utilUrlFromComp } from "~/util/util.url-from-comp";
import { utilWindow } from "~/util/util.window";

type Href = {
    path: string;
    query?: Record<string, string>;
};

type IProps = {
    children: ReactNode;
};
const storeUtil = utilCreateProvider({
    name: "Qurl",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useInitStore: (_props: IProps) => {
        const navigate = useNavigate();
        const loc = useLoc()
        const state = useMobState(() => ({
            searchParam: loc.search ?? "",
        }));

        const store = useCraftStore(() => ({
            get pathname() { return loc.pathname ?? "/" },
            get queryState() { return store.searchParam },
            get url() {
                return utilUrlFromComp({
                    pathname: store.pathname,
                    queryString: store.queryState,
                });
            },
            get href() { return utilStrToHref(store.url) },
            get query() { return store.href.query },
            get querystr() { return URLParse.qs.stringify(store.query) },
            getComputedQuery(iquery: Record<string, string | undefined> = {}, merge = false) {
                let newQuery: Record<string, string> = utilObjValExist(iquery);
                if (merge) {
                    let { query } = utilStrToHref(store.url);
                    newQuery = _.merge(_.clone(query), newQuery);
                }
                return newQuery;
            },
            setQueryStr(q: string) {
                state.setState({ searchParam: q });
                utilWindow().history.replaceState(
                    "",
                    "Change Qs",
                    utilUrlFromComp({ pathname: store.pathname, queryString: store.searchParam })
                );
            },
            setQuery(iquery: Record<string, string | undefined>, merge = true) {
                const newQuery = store.getComputedQuery(iquery, merge);
                store.setQueryStr("?" + URLParse.qs.stringify(newQuery));
            },
            set(route: Href | string, merge = false, /*newTab = false*/) {
                let myhref = typeof route == "string" ? utilStrToHref(route) : route;
                const newQuery = store.getComputedQuery(myhref.query, merge);
                let qstr = URLParse.qs.stringify(newQuery);
                const finalUrl = utilUrlFromComp({
                    pathname: myhref.path,
                    queryString: qstr,
                });
                if (myhref.path == store.pathname) {
                    store.setQuery(myhref.query ?? {}, merge);
                } else {
                    navigate(finalUrl);
                    state.setState({
                        searchParam: qstr
                    });
                }
            },
            queryVal(key: string, def: string) {
                return store.query[key] ?? def;
            },
            pathVal(num: number, def: string) {
                return store.pathname.split("/").filter(i => i)[num] ?? def;
            },
            getIsPathSync() {
                if (!utilHasWindow()) return false;
                return store.pathname == utilWindow().location.pathname;
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        return store;
    },
});

export const ProviderQurl = storeUtil.Provider;
export const useQurlStore = storeUtil.useStore;
