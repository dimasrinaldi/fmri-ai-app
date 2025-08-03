import { PageContainer, ProCard } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/node";
import { Avatar, Button, Flex, List, Typography } from "antd";
import { Building, KeyRoundIcon, UserRound, Wrench } from "lucide-react";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocDashboardProfile } from "./store";
import { Outlet } from "@remix-run/react";

const { Text } = Typography;

const pageTitle = "Profile";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const DashboardProfileRoute = hocDashboardProfile(({ store }) => {
    return <PageContainer title={false}>
        <Flex align="center" justify="center" gap={"small"}>
            <ProCard bordered style={{ maxWidth: 600 }} title={pageTitle}>
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        {
                            title: store.profile.name,
                            description: store.profile.username,
                            icon: <UserRound />,
                        },
                        {
                            title: "Password",
                            description: (
                                <Button
                                    size="small"
                                    type="link"
                                    onClick={() => store.onChangePassword()}
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                    }}
                                >
                                    Change Password
                                </Button>
                            ),
                            icon: <KeyRoundIcon />,
                        },
                        {
                            title: "Client",
                            description: store.profile.clientName,
                            icon: <Building />,
                        },
                        {
                            title: "Role",
                            description: store.profile.roleName,
                            icon: <Wrench />,
                        },
                    ]}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar size="large" icon={item.icon} />}
                                title={<Text strong>{item.title}</Text>}
                                description={<Text>{item.description}</Text>}
                            />
                        </List.Item>
                    )}
                />
                <Flex align="center" justify="center">
                    <Button danger onClick={() => store.onLogout()}>
                        Log out
                    </Button>
                </Flex>
            </ProCard>
        </Flex>
        <Outlet />
    </PageContainer>;
});

export default DashboardProfileRoute;
