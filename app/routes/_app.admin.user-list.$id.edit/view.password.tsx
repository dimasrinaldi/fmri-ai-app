import { MetaFunction } from "@remix-run/node";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocAdminUserListIdEdit, useAdminUserListIdEditStore } from "./store";
import { Alert, App, Button, Flex, Form, Input, Modal, Result, Select, Space, Switch, Typography } from "antd";
import { CheckCircleOutlined, CopyOutlined, SaveOutlined } from "@ant-design/icons";
import { utilSelectFilterOption } from "~/util/util.select-filter-option";
import { observer } from "mobx-react";

const ViewPassword = observer(() => {
    const store = useAdminUserListIdEditStore()
    const { message } = App.useApp();
    return <Modal
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
                title="User successfully added!"
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
    </Modal>;
});

export default ViewPassword;
