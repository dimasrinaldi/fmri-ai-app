import { Buffer } from "buffer";
import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
import { hocRoot } from "./store";
import { ViewClientOnly } from "~/view/view.client-only";

globalThis.Buffer = Buffer;

const Root = hocRoot(({ props, store }) => {
    return <div>
        {props.children}
        {/* <ToastContainer position="bottom-center" limit={1} /> */}
    </div>;
})

export default Root;