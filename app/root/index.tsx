import { Buffer } from "buffer";
import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
import { hocRoot } from "./store";

globalThis.Buffer = Buffer;

const Root = hocRoot(({ props, store }) => {
    return <div>Cupi huhuhaha
        {props.children}
        {/* <ToastContainer position="bottom-center" limit={1} /> */}
    </div>;
})

export default Root;

function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;
    return <>{children}</>;
}
