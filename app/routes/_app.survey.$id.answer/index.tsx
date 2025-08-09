import { SearchOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/node";
import { Button, Col, Flex, Input, Progress, Result, Row, Space, Spin, Statistic, Table, TableColumnsType } from "antd";
import Markdown from "react-markdown";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { ArrayElement } from "~/types";
import { useIsSpan } from "~/use/use.is-span";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewPageContainer from '../_app.survey.$id/view.page-container';
import { hocSurveyIdAnswer } from "./store";


const pageTitle = "Answer";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const SurveyIdRespondent = hocSurveyIdAnswer(({ store }) => {

    return (
        <ViewPageContainer
            title={pageTitle}
            extra={<Flex align="center" justify="space-between" gap={"small"}>
                <Space>
                    <Input
                        allowClear
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        value={store.search}
                        onChange={(e) => store.onSetSearch(e.target.value)}
                    />
                </Space>
            </Flex>}
        >
            <Flex vertical gap={"middle"}>
                <Row gutter={[16, 16]} >
                    <Col xs={8} sm={12} xl={5}>
                        <ProCard>
                            <Statistic title="Answered Respondent" value={store.count} />
                        </ProCard>
                    </Col>
                    <Col xs={8} sm={12} xl={5}>
                        <ProCard>
                            <Statistic title="Total Respondent" value={store.countTotal} />
                        </ProCard>
                    </Col>
                    <Col xs={8} sm={8} xl={4}>
                        <ProCard>
                            <Statistic precision={2} title="Percentage" value={store.countPercent} suffix="%" />
                            <Progress status={store.answeringStatus == "idle" ? "normal" : "active"} percent={store.countPercent} showInfo={false} />
                        </ProCard>
                    </Col>
                    <Col xs={24} sm={16} xl={10}>
                        <ProCard title="Get AI Answer for Unanswered Respondents" >
                            <Flex gap={"small"}>
                                {["answering", "stopping"].includes(store.answeringStatus) && <Button disabled loading>
                                    {store.answeringStatus == "answering" ? "Answering" : "Stopping"}
                                </Button>}
                                {store.answeringStatus == "idle" && store.countPercent < 100 && <Button variant="solid" color="blue" onClick={() => store.onStartAnswerAi()} >Start</Button>}
                                {store.answeringStatus == "answering" && <Button color="orange" variant="outlined" onClick={() => store.onStopAnswerAi()}>Stop</Button>}
                                {store.countPercent > 0 && <Button loading={store.isClearAnswerLoading} onClick={() => store.onClearAnswers()} color="red" variant="outlined">Clear all AI answers</Button>}
                            </Flex>
                        </ProCard>
                    </Col>
                </Row>
                <Table
                    size="middle"
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
                    rowKey="id"
                    columns={[
                        { title: "ID", dataIndex: "id" },
                        { title: "City", dataIndex: "city" },
                        { title: "Gender", dataIndex: "gender" },
                        { title: "Age", dataIndex: "age" },
                        { title: "Occupation", dataIndex: "occupation" },
                        { title: "Marital Status", dataIndex: "maritalStatus" },
                        { title: "SEC", dataIndex: "sec" },
                    ]}
                    dataSource={store.items}
                    onChange={(pagination, filters, sorter: any, { action }) => {
                        if (action == "paginate") {
                            const { current: page, pageSize: size } = pagination;
                            store.onSetPagination((page ?? 0) - 1, size ?? 0);
                        }
                    }}
                />
                <Spin spinning={store.isListLoading}>
                    {store.items.length == 0
                        ? <Result title="No answer found" />
                        : <ProCard bordered>
                            <Markdown>{store.items[0].answer}</Markdown>
                        </ProCard>}
                </Spin>
                <Table
                    size="middle"
                    bordered
                    scroll={{ x: true }}
                    pagination={false}
                    loading={store.isListLoading}
                    style={{ whiteSpace: "nowrap" }}
                    rowKey="id"
                    columns={[
                        { title: "Question", dataIndex: "question" },
                        { title: "Answer Content", dataIndex: "answerContent" },
                        { title: "Answer Score", dataIndex: "answerScore" },
                        { title: "Answer Category", dataIndex: "answerCategory" },
                        { title: "Awareness", dataIndex: "awareness" },
                    ]}
                    dataSource={store.surveyData}
                />
            </Flex>
        </ViewPageContainer>
    );
});

export default SurveyIdRespondent;
