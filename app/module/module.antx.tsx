import { utilLazyView } from "~/util/util.lazy-view";

export const AntxSender = utilLazyView(
    () => import("@ant-design/x").then(x => x.Sender)
)

export const AntxWelcome = utilLazyView(
    () => import("@ant-design/x").then(x => x.Welcome)
)

export const AntxBubbleList = utilLazyView(
    () => import("@ant-design/x").then(x => x.Bubble.List)
)