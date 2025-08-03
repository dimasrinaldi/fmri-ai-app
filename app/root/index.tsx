import { Buffer } from "buffer";
import { ToastContainer } from "react-toastify";
import { utilMajson } from "~/util/util.majson";
import Auth from "./auth";
import { hocRoot } from "./store";
import { ViewClientOnly } from "~/view/view.client-only";

globalThis.Buffer = Buffer;

const Root = hocRoot(({ props, store }) => {
    return <div style={{ display: store.isApiInitFetched ? undefined : "none" }}>
        <Auth>
            {props.children}
            {/* <ViewClientOnly>{() => <ToastContainer position="bottom-center" limit={1} />}</ViewClientOnly> */}
        </Auth>
        <script
            dangerouslySetInnerHTML={{
                __html: `window.ENV = ${utilMajson.stringify(store.publicEnv)}`,
            }}
        />
    </div>;
})

export default Root;


