import { InboxOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { MetaFunction } from "@remix-run/node";
import { Alert, Button, Checkbox, Col, DatePicker, Divider, Empty, Flex, Form, Image, Input, InputNumber, Popover, Radio, Row, Space, Spin, Table, Tag, Tooltip, Typography, Upload } from "antd";
import dayjs from "dayjs";
import { Observer } from "mobx-react";
import { ReactNode } from "react";
import { dataRunningDistance, getDataRunningDistance } from "~/data/data.running-distance";
import useVal from "~/use/use.val";
import { utilMetaTitle } from "~/util/util.meta-title";
import { utilTitleCase } from "~/util/util.title-case";
import ViewPageContainer from '../_app.shoe-detection/view.page-container';
import { hocShoeDetectionRecognizing } from "./store";


const pageTitle = "Recognizing Object";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const ShoeDetectionRecognizing = hocShoeDetectionRecognizing(({ store }) => {

    return <ViewPageContainer
        title={pageTitle}
        extra={<Flex align="center" justify="space-between" gap={"small"}>
            <Input
                allowClear
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={store.search}
                onChange={(e) => store.onSetSearch(e.target.value)}
            />
        </Flex>}
    >

        <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
                <Spin spinning={store.isSubmiting}>
                    <Form
                        layout="horizontal"
                    >
                        <Form.Item {...(store.formErr.eventName && {
                            help: store.formErr.eventName,
                            validateStatus: "error",
                        })}>
                            <Input
                                prefix="Event Name :"
                                value={store.eventName}
                                onChange={(e) => store.setState({ eventName: e.target.value?.toUpperCase() })}
                                placeholder="Fill here"
                            />
                        </Form.Item>
                        <Divider >Race distance categorization</Divider>
                        <Form.Item label="Options">
                            <Checkbox.Group options={dataRunningDistance.map(i => ({
                                value: i.id,
                                label: i.id,
                            }))}
                                value={store.inputDistanceVars.map(i => i.id)}
                                onChange={(val) => store.onChangeDistanceCheckbox(val)}
                            />
                        </Form.Item>
                        {/* <Divider /> */}
                        {store.formErr.distanceVars && <Form.Item><Alert type="error" message={"Distance : " + store.formErr.distanceVars} /></Form.Item>}
                        <Form.Item>
                            <Space style={{ width: "100%" }} size={0} direction="vertical" split={<Divider style={{ padding: 0, margin: "0px 0px 20px" }} />}>
                                {store.inputDistanceVars.length === 0 && <Flex justify="center">
                                    <Empty description={<>No distance input selected.<br />Please choose distance options above</>} />
                                </Flex>}
                                {store.inputDistanceVars.map((i, ix) => {
                                    const distanceLabel = useVal(() => {
                                        let label: ReactNode = getDataRunningDistance(i.id).id;
                                        if (i.isSome) label = <b>{label}</b>
                                        return label;
                                    })
                                    return <div key={ix}>
                                        <Form.Item label={distanceLabel}>
                                            <DatePicker
                                                needConfirm={false}
                                                style={{ width: "100%" }}
                                                showTime={{ format: "HH:mm" }}
                                                prefix={<span style={{ whiteSpace: 'nowrap' }}>Started at</span>}
                                                value={i.startedAt ? dayjs(i.startedAt) : null}
                                                onChange={(value) => store.onSetDistanceVar(i.id, "startedAt", value ? value.format() : "")}
                                            />
                                        </Form.Item>
                                        <Row gutter={[8, 0]}>
                                            <Col xs={24} md={12}>
                                                <Form.Item>
                                                    <Input prefix="Color"
                                                        value={i.color}
                                                        onChange={(e) => store.onSetDistanceVar(i.id, "color", e.target.value)}
                                                        placeholder="Description"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item >
                                                    <InputNumber prefix="KM"
                                                        style={{ width: "100%" }}
                                                        value={i.km}
                                                        onChange={(value) => store.onSetDistanceVar(i.id, "km", value?.toString() ?? "0")}
                                                        placeholder="Number"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                })}
                            </Space>
                        </Form.Item>
                        <Form.Item>
                            <Typography.Text>There are <strong>{store.fileList.length} images</strong> ready to be uploaded.</Typography.Text>
                        </Form.Item>
                        <Form.Item>
                            <Upload.Dragger
                                multiple
                                maxCount={10}
                                name="file"
                                accept=".jpg,.png,.jpeg"
                                showUploadList={false}
                                beforeUpload={() => false}
                                listType="text"
                                fileList={store.fileList}
                                onChange={({ fileList: newFileList }) => {
                                    store.setFileList(newFileList);
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                        <Observer>{() => {
                            const elems = [
                                { enabled: store.isFilledSomeForm, comp: <Button key={"1"} onClick={() => store.onResetInputs()}>Reset form</Button> },
                                { enabled: store.fileList.length > 0, comp: <Button key={"2"} type="default" onClick={() => store.setFileList([])}>Clear Queued Images</Button> },
                            ].filter(i => i.enabled);
                            if (elems.length == 0) return null
                            return <Form.Item>
                                <Flex gap={"small"} justify="center">{elems.map(i => i.comp)}</Flex>
                            </Form.Item>;
                        }}</Observer>
                    </Form>
                </Spin>
                <Flex gap={10} justify="center" align="center">
                    {!store.isReadyTobeSubmitted ? <Typography.Text>Please fill in the form above correctly</Typography.Text>
                        : store.isSubmiting ? <Button onClick={() => store.onStopSubmitting()} color="orange">Stop the process</Button>
                            : <Flex align="center" gap="small" wrap>
                                <div>On duplicate file &nbsp;
                                    <Popover content={<>
                                        <div>If the file name already exists in the database<br />for the same <b>client</b> and <b>event date</b></div>
                                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0 }}>
                                            <li>Skip : Skip processing file</li>
                                            <li>Replace : Replace the existing record</li>
                                        </ul>
                                    </>}><QuestionCircleOutlined /></Popover>
                                </div>
                                <Radio.Group
                                    optionType="button"
                                    options={[{
                                        label: "Skip",
                                        value: "skip",
                                    }, {
                                        label: "Replace",
                                        value: "replace",
                                    }]}
                                    value={store.onDuplicate}
                                    onChange={() => store.onToggleDuplicateMode()}
                                />
                                <Button onClick={() => store.onSubmit()} type="primary">Submit</Button>
                            </Flex>
                    }
                </Flex>
            </Col>
            <Col xs={24} md={16}>
                <Table
                    bordered
                    scroll={{ x: true }}
                    showSorterTooltip={{ mouseLeaveDelay: 0 }}
                    pagination={{
                        size: "default",
                        total: store.count,
                        current: store.page + 1,
                        pageSize: store.limit,
                        showTotal: (total, [start, end]) => `${start}-${end} of ${total}`,
                    }}
                    loading={store.isListLoading}
                    style={{ whiteSpace: "nowrap" }}
                    rowKey="imageName"
                    columns={[
                        {
                            title: <Flex justify="space-between" align="center">
                                <Typography.Text strong>Data</Typography.Text>
                                {/* <Flex gap="small">
                                    <Button disabled={store.isEdit} size="small" onClick={() => store.onToggleIsEdit()} >Edit{store.isEdit && " Mode"}</Button>
                                    <Button size="small" onClick={() => { }} danger >Delete</Button>
                                </Flex> */}
                            </Flex>,
                            dataIndex: "imageUrl", render: (text) => {
                                return <Flex vertical gap={30} justify="center" >
                                    <Flex vertical justify="center" gap={10}>
                                        {store.recItems.map((i, ikey) => {
                                            return <Flex wrap gap={10} key={i.id}>
                                                <div>Person {ikey + 1} :</div>
                                                {Object.keys(i).filter(i => ["gender", "color", "brand", "model", "event", "distance", "minuteKm", "runningNum"].includes(i)).map((key) => {
                                                    const value = i[key as keyof typeof i];
                                                    const color = value && key == "color" ? value?.toString() : "unset";
                                                    const textShadow = value && key == "color" ? "1px 1px 2px black" : "unset";
                                                    return <Tag key={key}>{utilTitleCase(key).toUpperCase()} : <span style={{
                                                        color, textShadow
                                                    }}>{value}</span></Tag>
                                                })}
                                            </Flex>
                                        })}
                                    </Flex>
                                    <Image src={text} alt="Image to be detected" width="100%" />
                                </Flex>
                            }
                        },
                    ]}
                    dataSource={store.items}
                    onChange={(pagination, __, ___, { action }) => {
                        if (action == "paginate") {
                            const { current: page, pageSize: size } = pagination;
                            store.onSetPagination((page ?? 0) - 1, size ?? 0);
                        }
                    }}
                />
            </Col>

        </Row>
    </ViewPageContainer>
});

export default ShoeDetectionRecognizing;
