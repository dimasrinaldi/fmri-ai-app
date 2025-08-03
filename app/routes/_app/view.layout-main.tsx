import { ProLayout, ProLayoutProps } from "@ant-design/pro-components";
import { Flex } from "antd";
import { Observer, observer, useLocalObservable } from "mobx-react";
import { useMount, useUnmount } from "react-use";
import usePublicEnv from "~/use/use.publicEnv";
import { useAppStore } from "./store";
import { useState } from "react";
import { useQurlStore } from "~/provider/provider.qurl";

const ViewLayoutMain = observer((props: ProLayoutProps) => {

    const store = useAppStore();
    const env = usePublicEnv()
    const qurl = useQurlStore()

    useMount(() => {
        store.setIsMainLayout(true);
    })
    useUnmount(() => {
        store.setIsMainLayout(false);
    })

    return <ProLayout
        bgLayoutImgList={[
            {
                src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                bottom: 0,
                left: 0,
                width: '331px',
            },
        ]}
        layout='side'
        suppressSiderWhenMenuEmpty={true}
        menuProps={{
            onClick: (props) => {
                store.onToPage(props.key)
            },
        }}
        fixSiderbar={true}
        siderMenuType="group"
        menu={{
            loading: false,
            collapsedShowGroupTitle: true,
        }}
        menuFooterRender={(props) => <Observer>{() => props?.collapsed ? <></> : <Flex
            justify='center'
            align="center"
            style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}
        >
            © {new Date().getFullYear()} {env.companyName} Company. <br />All rights reserved.
        </Flex>}</Observer>}
        {...props}
    >
        {props.children}
    </ProLayout>;
});

export default ViewLayoutMain;
