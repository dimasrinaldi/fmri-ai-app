import { MetaFunction } from "@remix-run/node";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocProfileChangePassword } from "./store";
import { Button, Divider, Form, Input, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";

const pageTitle = "Change Password";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const ProfileChangePasswordRoute = hocProfileChangePassword(({ store }) => {
    console.log("hsjdfhsdkjfhsdkjfh")
    return (
        <Modal
            open
            title={pageTitle}
            okText="Submit"
            okButtonProps={{
                loading: store.isSubmitLoading,
                icon: <SendOutlined />,
            }}
            onOk={() => store.onSubmit()}
            onCancel={() => store.onClose()}
        >
            <Form layout="vertical" onFinish={() => store.onSubmit()}>
                <Form.Item
                    label="Old Password"
                    {...(store.formErr.old_password && {
                        help: store.formErr.old_password,
                        validateStatus: "error",
                    })}
                >
                    <Input.Password
                        name="old-password"
                        disabled={store.isSubmitLoading}
                        value={store.oldPassword}
                        onChange={(e) => store.setState({ oldPassword: e.target.value })}
                    />
                </Form.Item>
                <Divider />
                <Form.Item
                    label="New Password"
                    help="Min. 8 characters in length containing lower and upper case characters, numbers and symbols"
                    {...(store.formErr.new_password && {
                        help: store.formErr.new_password,
                        validateStatus: "error",
                    })}
                >
                    <Input.Password
                        name="new-password"
                        disabled={store.isSubmitLoading}
                        value={store.newPassword}
                        onChange={(e) => store.setState({ newPassword: e.target.value })}
                    />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    {...(store.formErr.password_confirmation && {
                        help: store.formErr.password_confirmation,
                        validateStatus: "error",
                    })}
                >
                    <Input.Password
                        name="confirm-password"
                        disabled={store.isSubmitLoading}
                        value={store.passwordConfirmation}
                        onChange={(e) => store.setState({ passwordConfirmation: e.target.value })}
                    />
                </Form.Item>
                <Button style={{ display: "none" }} htmlType="submit"></Button>
            </Form>
        </Modal>
    );
});

export default ProfileChangePasswordRoute;
