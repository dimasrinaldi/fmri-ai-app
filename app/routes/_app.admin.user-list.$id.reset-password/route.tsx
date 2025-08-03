import { MetaFunction } from "@remix-run/node";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocAdminUserListIdResetPassword } from "./store";
import { Alert, App, Button, Flex, Input, Modal, Result, Space, Typography } from "antd";
import { CheckCircleOutlined, CopyOutlined, UndoOutlined } from "@ant-design/icons";

const { Text } = Typography;

const pageTitle = "Reset Password";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const AdminUserListIdResetPasswordRoute = hocAdminUserListIdResetPassword(({ store }) => {
    const { message } = App.useApp();

    const resetPasswordModal = (
        <Modal
            open={!store.openPasswordModal}
            title={pageTitle}
            okText="Reset"
            okButtonProps={{
                danger: true,
                loading: store.isSubmitLoading,
                icon: <UndoOutlined />,
            }}
            onOk={() => store.onSubmit()}
            onCancel={() => store.onClose()}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <Text>Are you sure you want to reset password for <Text strong>{store.userData.name}</Text>?</Text>
                <Alert
                    showIcon
                    type="warning"
                    message="This action cannot be undone!"
                />
            </Space>
        </Modal>
    );

    const passwordModal = (
        <Modal
            open={store.openPasswordModal}
            closeIcon={false}
            footer={
                <Button
                    type="primary"
                    disabled={!store.passwordCopied}
                    onClick={() => store.onClose()}
                >
                    OK
                </Button>
            }
        >
            <Space direction="vertical">
                <Result
                    status="success"
                    title="Password successfully reset!"
                    subTitle="A secure password was generated for this user. Remind them to change their password immediately!"
                    style={{ paddingTop: 36, paddingBottom: 12 }}
                />
                <Alert
                    showIcon
                    type="warning"
                    message="You cannot access the password again after clicking 'OK'"
                />
                <Flex gap={8}>
                    <Input.Password readOnly value={store.password} />
                    <Button
                        type={store.passwordCopied ? "default" : "primary"}
                        icon={store.passwordCopied ? <CheckCircleOutlined /> : <CopyOutlined />}
                        onClick={async () => {
                            await navigator.clipboard.writeText(store.password);
                            store.setState({ passwordCopied: true });
                            message.success("Password copied");
                        }}
                    >
                        {store.passwordCopied ? "Copied" : "Copy"}
                    </Button>
                </Flex>
            </Space>
        </Modal>
    );

    return (
        <>
            {resetPasswordModal}
            {passwordModal}
        </>
    );
});

export default AdminUserListIdResetPasswordRoute;
