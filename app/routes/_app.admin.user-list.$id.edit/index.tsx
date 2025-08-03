import { SaveOutlined } from "@ant-design/icons";
import { MetaFunction } from "@remix-run/node";
import { Alert, Button, Flex, Form, Input, Modal, Select, Space, Switch, Typography } from "antd";
import { utilMetaTitle } from "~/util/util.meta-title";
import { utilSelectFilterOption } from "~/util/util.select-filter-option";
import { hocAdminUserListIdEdit } from "./store";
import ViewPassword from "./view.password";

const { Text } = Typography;

const pageTitle = "Edit User";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const hocAdminUserListIdEditRoute = hocAdminUserListIdEdit(({ store }) => {
    return <>
        <Modal
            open
            loading={store.oneIsLoading}
            destroyOnClose
            title={store.isEdit ? "Edit User" : "New User"}
            onCancel={() => store.onClose()}
            footer={false}
        >
            {store.oneIsError ? <Alert
                message="Invalid parameters"
                type="error"
            /> : <Form onFinish={() => store.onSubmit()} layout="vertical">
                <Form.Item
                    label="Name"
                    {...(store.formErr.name && {
                        help: store.formErr.name,
                        validateStatus: "error",
                    })}
                >
                    <Input
                        name="name"
                        placeholder="Type here"
                        disabled={store.isSubmitLoading}
                        value={store.name}
                        onChange={(e) => store.setState({ name: e.target.value })}
                    />
                </Form.Item>
                <Form.Item
                    label="Username"
                    {...(store.formErr.username && {
                        help: store.formErr.username,
                        validateStatus: "error",
                    })}
                >
                    <Input
                        name="username"
                        placeholder="Type here"
                        disabled={store.isEdit}
                        value={store.username}
                        onChange={(e) => store.setState({ username: e.target.value })}
                    />
                </Form.Item>
                <Form.Item
                    label="Client"
                    {...(store.formErr.clientId && {
                        help: store.formErr.clientId,
                        validateStatus: "error",
                    })}
                >
                    <Select
                        showSearch
                        placeholder="Select one"
                        disabled={store.isSubmitLoading}
                        optionFilterProp="children"
                        filterOption={utilSelectFilterOption}
                        options={store.clients}
                        value={store.clientId || undefined}
                        onChange={(value) => store.setState({ clientId: value })}
                    />
                </Form.Item>
                <Form.Item
                    label="Role"
                    {...(store.formErr.roleId && {
                        help: store.formErr.roleId,
                        validateStatus: "error",
                    })}
                >
                    <Select
                        showSearch
                        placeholder="Select one"
                        disabled={store.isSubmitLoading}
                        optionFilterProp="children"
                        filterOption={utilSelectFilterOption}
                        options={store.roles}
                        value={store.roleId || undefined}
                        onChange={(value) => store.setState({ roleId: value })}
                    />
                </Form.Item>
                {store.isEdit && <Form.Item
                    label="Status"
                    {...(store.formErr.status && {
                        help: store.formErr.status,
                        validateStatus: "error",
                    })}
                >
                    <Space>
                        <Switch
                            disabled={store.isSubmitLoading}
                            checked={store.status == "Active"}
                            onChange={(value) => store.setState({ status: value ? "Active" : "Inactive" })}
                        />
                        {store.status}
                    </Space>
                </Form.Item>}
                <Flex gap="small" justify="end">
                    {Object.values(store.formErr).some((i) => i) && <Text type="danger">Some fields are not filled correctly</Text>}
                    <Button onClick={() => store.onClose()}>Cancel</Button>
                    <Button
                        type="primary"
                        loading={store.isSubmitLoading}
                        icon={<SaveOutlined />}
                        htmlType="submit"
                    >
                        Save
                    </Button>
                </Flex>
            </Form>}
        </Modal>
        <ViewPassword />
    </>;
});

export default hocAdminUserListIdEditRoute;
