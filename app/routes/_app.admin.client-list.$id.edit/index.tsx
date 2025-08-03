import { MetaFunction } from "@remix-run/node";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocAdminClientListIdEdit } from "./store";
import { Alert, Button, Flex, Form, Input, Modal, Select, Space, Spin, Switch, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { utilSelectFilterOption } from "~/util/util.select-filter-option";
import { Observer } from "mobx-react";

const { Text } = Typography;

const pageTitle = "Edit Client";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const AdminClientListIdEditRoute = hocAdminClientListIdEdit(({ store }) => {
    return (
        <Modal
            loading={store.oneIsLoading}
            open
            destroyOnClose
            title={store.isEdit ? "Edit Client" : "New Client"}
            onCancel={() => store.onClose()}
            footer={false}
        >
            {store.oneIsError ? <Alert
                message="Invalid parameters"
                type="error"
            /> : <Form
                onFinish={() => store.onSubmit()}
                layout="vertical"
            >
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
                </Form.Item>
                <Form.Item
                    label="Access Control List (ACL)"
                    help="Leave empty for all features"
                    {...(store.formErr.apps && {
                        help: store.formErr.apps,
                        validateStatus: "error",
                    })}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select multiple"
                        disabled={store.isSubmitLoading}
                        allowClear
                        filterOption={utilSelectFilterOption}
                        options={store.appOptions}
                        value={store.apps}
                        onChange={(values) => store.setState({ apps: values })}
                    />
                </Form.Item>
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
    );
});

export default AdminClientListIdEditRoute;
