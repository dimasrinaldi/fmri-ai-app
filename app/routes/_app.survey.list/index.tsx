import { SearchOutlined } from "@ant-design/icons";
import PageContainer from "~/routes/_app.survey/view.page-container";
import { ProCard } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/node";
import { Button, Empty, Flex, Input, Space, Spin, Typography } from "antd";
import { BotIcon, CalendarCheck, Users2Icon } from "lucide-react";
import { useIsSpan } from "~/use/use.is-span";
import { utilDtStr } from "~/util/util.dt-str";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocSurveyList } from "./store";

const pageTitle = "List of Surveys";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const SurveyListRoute = hocSurveyList(({ store }) => {
    const span = useIsSpan();
    return (
        <PageContainer
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
            <Spin style={{ width: "100%" }} spinning={store.isListLoading}>
                {store.items.length == 0
                    ? <Empty />
                    : <Flex wrap gap={"middle"} >
                        {store.items.map(i => <ProCard
                            bordered
                            // boxShadow
                            onClick={() => store.onClickSurveyList(i.id)}
                            hoverable
                            style={{ maxWidth: span.sm ? "100%" : 300 }}
                            key={i.id}
                            title={i.title}
                        >   <Flex vertical gap="small">
                                <Typography.Text>
                                    {i.description.length <= 100
                                        ? i.description
                                        : i.description.slice(0, 100) + "..."
                                    }
                                </Typography.Text>
                                <Flex gap={"small"}><CalendarCheck /> {utilDtStr("full", i.createdAt,)}</Flex>
                                <Flex gap={"small"}>
                                    {i.respondentType == "Real" ? <Users2Icon color="green" /> : <BotIcon color="red" />}
                                    <Typography.Text>{i.respondentType} Respondent</Typography.Text>
                                </Flex>

                            </Flex>
                        </ProCard>)}
                    </Flex>}
                {!store.isReachTotal && <Button onClick={() => store.onMore()}>More ..</Button>}
            </Spin>
        </PageContainer>
    );
});

export default SurveyListRoute;
