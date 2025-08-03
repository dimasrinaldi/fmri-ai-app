import { LoginOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/node";
import { Alert, Button, Flex, Form, Image, Input, Typography } from "antd";
import usePublicEnv from "~/use/use.publicEnv";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocLogin } from "./store";

const { Title, Text } = Typography;

const pageTitle = "Log in";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const LoginRoute = hocLogin(({ store }) => {
    const env = usePublicEnv()
    return <>
        <Flex vertical justify="center" align="center" style={{ height: "100vh" }}>
            <div style={{
                top: 10,
                bottom: 10,
                position: "absolute",
                height: "100vh",
                width: "100vw",
                background: `url("/bg-with-logo-line.png")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
            }} />
            <Flex style={{ margin: 10 }}>
                <ProCard bordered style={{ minWidth: 350 }}>
                    <Flex justify="center" >
                        <Button type="link" onClick={() => store.onToIndex()}>
                            <Flex gap={"small"} align="center">
                                <Image
                                    className="brand-logo"
                                    height={40}
                                    preview={false}
                                    src={env.logoPath}
                                />
                            </Flex>
                        </Button>
                    </Flex>
                    <Title style={{ fontSize: 24, textAlign: "center" }}>Log in</Title>
                    {store.formErr.invalidLogin && (
                        <Alert
                            showIcon
                            type="error"
                            style={{ marginBottom: 20 }}
                            message={store.formErr.invalidLogin}
                        />
                    )}
                    {store.isAuth ? <Button block onClick={() => store.onToHome()} type="primary" icon={<LoginOutlined />}>Login</Button>
                        : <Form
                            onFinish={() => store.onSubmit()}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Username"
                                {...(store.formErr.username && {
                                    help: store.formErr.username,
                                    validateStatus: "error",
                                })}
                            >
                                <Input
                                    size="large"
                                    name="username"
                                    disabled={store.isSubmitLoading}
                                    value={store.username}
                                    onChange={(e) => store.setState({ username: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                {...(store.formErr.password && {
                                    help: store.formErr.password,
                                    validateStatus: "error",
                                })}
                            >
                                <Input.Password
                                    size="large"
                                    name="password"
                                    disabled={store.isSubmitLoading}
                                    value={store.password}
                                    onChange={(e) => store.setState({ password: e.target.value })}
                                />
                            </Form.Item>
                            <Button
                                htmlType="submit"
                                size="large"
                                block
                                type="primary"
                                style={{ marginTop: 10 }}
                                loading={store.isSubmitLoading}
                            >
                                Log in
                            </Button>
                        </Form>}
                </ProCard>
            </Flex>
        </Flex>
    </>;
});

export default LoginRoute;
