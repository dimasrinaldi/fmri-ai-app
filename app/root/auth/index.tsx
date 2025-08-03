import ViewLoadingLogo from "~/view/loading-pages/view.loading-logo";
import { hocAuth } from "./store";
const Auth = hocAuth(({ props, store }) => {
    if (!store.isApiInitFetched) return <ViewLoadingLogo />;
    return props.children;
});
export default Auth;
