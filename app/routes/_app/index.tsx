import { ProLayout } from "@ant-design/pro-components";
import { Outlet } from '@remix-run/react';
import { Button, Dropdown, Flex, Select, Space, theme } from "antd";
import { ListRestart, LogOut, UserCogIcon } from "lucide-react";
import { Observer } from "mobx-react";
import usePublicEnv from "~/use/use.publicEnv";
import ViewLoadingLogo from "~/view/loading-pages/view.loading-logo";
import { hocApp, useAppStore } from "./store";

const AppRoute = hocApp(() => {
    const store = useAppStore();
    const { token } = theme.useToken();
    const env = usePublicEnv()
    return <ProLayout
        logo={env.logoPath}
        title={false}

        className="first-layout"
        fixedHeader
        layout='top'

        hasSiderMenu={false}
        collapsedButtonRender={false}

        actionsRender={() => <Observer>{() =>
            <Space>
                <Button
                    key="home"
                    onClick={() => store.onToPage("/home")}
                >
                    Features
                </Button>
                {store.access.featAdmin && <Button
                    key="admin"
                    onClick={() => store.onToPage("/admin/client-list")}
                >
                    Admin
                </Button>}
                {store.access.levelSuper ? <Select
                    loading={!store.isFetchedClient}
                    placeholder="Client"
                    style={{ width: 150 }}
                    value={store.activeClient.id}
                    showSearch
                    options={store.clientOptions}
                    onSelect={store.selectClientId}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                /> : <Button disabled style={{
                    color: "white",
                    cursor: "default"
                }}>
                    {store.activeClient.name}
                </Button>}
            </Space>}
        </Observer>}

        avatarProps={{
            src: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
            size: 'small',
            title: store.profileName,
            render: (props, dom) => {
                return <Observer>{() => <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: 'profile',
                                icon: <UserCogIcon />,
                                label: 'Profile',
                                onClick: () => store.onToPage("/profile"),
                            },
                            {
                                key: 'clearState',
                                icon: <ListRestart />,
                                label: 'Clear State',
                                onClick: () => store.onClearSavedState(),
                            },
                            {
                                key: 'logout',
                                icon: <LogOut />,
                                label: 'Logout',
                                onClick: () => store.onLogout(),
                            },

                        ],
                    }}
                >
                    {dom}
                </Dropdown>}</Observer>
            },
        }}

        footerRender={() => store.isMainLayout ? false : <Flex
            justify='center'
            style={{ marginTop: 20, marginBottom: 20 }}
        >
            © {new Date().getFullYear()} {env.companyName} Company. All rights reserved.
        </Flex>}
    >
        {store.isFetchedClient ?
            <Outlet /> :
            <ViewLoadingLogo />
        }
    </ProLayout>
});
export default AppRoute;