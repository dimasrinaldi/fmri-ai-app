import { MetaFunction } from "@remix-run/node";
import { Alert, AutoComplete, Button, Col, Flex, Form, Image, Input, Modal, Row, Typography } from "antd";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { utilMetaTitle } from "~/util/util.meta-title";
import { utilTitleCase } from "~/util/util.title-case";
import { hocShoeDetectionDataIdEdit } from "./store";
import { Observer } from "mobx-react";
import useVal from "~/use/use.val";
import { dataRunningDistance } from "~/data/data.running-distance";
import { dataCatMinuteKm } from "~/data/data.cat-minute-km";

const { Text } = Typography;

const pageTitle = "Edit Client";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const ShoeDetectionDataIdEdit = hocShoeDetectionDataIdEdit(({ store }) => {
    return (
        <Modal
            loading={store.oneIsLoading}
            open
            title={"Edit Data"}
            onCancel={() => store.onClose()}
            destroyOnClose
            footer={!store.oneIsError && <Flex
                gap="small" justify="end" align="center">
                {Object.values(store.formErr).some(Boolean) && <Text type="danger">Invalid inputs</Text>}
                <Button
                    type="primary"
                    loading={store.isSubmitLoading}
                    icon={<SaveIcon />}
                    onClick={() => store.onSubmit()}
                >
                    Save
                </Button>
                <Button
                    danger
                    loading={store.isDeleteLoading}
                    icon={<Trash2Icon />}
                    onClick={() => store.onDelete()}
                >
                    Delete
                </Button>
                <Button onClick={() => store.onClose()}>Cancel</Button>

            </Flex>
            }
        >
            {store.oneIsError ? <Alert
                message="Invalid parameters"
                type="error"
            /> : <Form
                onFinish={() => store.onSubmit()}
                layout="vertical"
            >
                <Button style={{ display: "none" }} htmlType="submit" />
                {store.imageUrl &&
                    <Form.Item><Image src={store.imageUrl} /></Form.Item>}
                <Row gutter={16}>
                    {store.keyForms.map(i => {
                        const label = i == "runningNum" ? "Bib Number" : utilTitleCase(i);
                        return <Col key={i} xs={12}>
                            <Form.Item
                                label={label}
                                {...(store.formErr[i] && {
                                    help: store.formErr[i],
                                    validateStatus: "error",
                                })}
                            >
                                <Observer>{() => {
                                    const options = useVal(() => {
                                        let myOptions = i == "gender" ? ["FEMALE", "MALE"] :
                                            i == "podium" ? ["YES", "NO"] :
                                                i == "distance" ? dataRunningDistance.map(i => i.id) :
                                                    i == "minuteKm" ? dataCatMinuteKm.map(i => i.label) : [];
                                        return myOptions.map((item) => ({
                                            label: item,
                                            value: item,
                                        }))
                                    })

                                    return <AutoComplete
                                        options={options}
                                        placeholder="Type here"
                                        value={store[i]}
                                        onChange={(value) => store.onSetFormValue(i, value)}
                                    />
                                }}</Observer>
                            </Form.Item>
                        </Col>
                    })}
                </Row>
            </Form>}
        </Modal>
    );
});

export default ShoeDetectionDataIdEdit;
