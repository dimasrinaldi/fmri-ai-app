import { PageContainer, PageContainerProps } from "@ant-design/pro-components";
import { Breadcrumb, Button, Flex, FloatButton, Typography } from "antd";
import { BotMessageSquare } from "lucide-react";
import { observer } from "mobx-react";
import useVal from "~/use/use.val";
import { useAppStore } from "./store";
import ViewChatModal from "./view.chat-modal";

interface Props extends PageContainerProps {
    showAi?: boolean;
}
const ViewPageContainer = observer((props: Props) => {
    const { title, extra, breadcrumb, ...extProps } = props;
    const store = useAppStore();
    const showAi = useVal(() => store.isShowAi && props.showAi);
    const myBreadcrumb = useVal(() => {
        const items = breadcrumb?.items?.map((item) => {
            return {
                ...item,
                key: item.key || item.path,
                onClick: item.onClick || ((e) => {
                    e.preventDefault();
                    const href = e.currentTarget.getAttribute('href');
                    if (!href) return;
                    store.qurl.set(href);
                }),
            }
        });
        return { ...breadcrumb, items };
    });
    return <>
        <PageContainer
            {...extProps}
            breadcrumb={{ items: [] }}
            extra={<Flex gap={"small"}>
                {extra}
                {showAi && <Button onClick={() => store.setAiModal(true)} icon={<BotMessageSquare />}>Ask</Button>}
            </Flex>}
            title={<Flex vertical gap={"small"}>
                <Breadcrumb {...myBreadcrumb} />
                {title}
            </Flex>}
        />
        {showAi && <>
            <ViewChatModal />
            <FloatButton
                type="primary"
                icon={<BotMessageSquare />}
                onClick={() => store.setAiModal(true)}
            />
        </>}
    </>
});

export default ViewPageContainer;
