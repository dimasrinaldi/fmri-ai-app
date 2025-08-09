import { ProCard } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/node";
import { Button, Tag, Typography } from "antd";
import { Edit } from "lucide-react";
import { utilDtStr } from "~/util/util.dt-str";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewLoadingLogo from "~/view/loading-pages/view.loading-logo";
import ViewPageContainer from '../_app.survey.$id/view.page-container';
import { hocSurveyIdInfo } from "./store";
import Markdown from 'react-markdown'


const pageTitle = "Survey Information";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const SurveyIdRespondent = hocSurveyIdInfo(({ store }) => {
    return (
        <ViewPageContainer
            title={pageTitle}
        // extra={<Button icon={<Edit />} type="primary">Edit</Button>}
        >
            {store.isLoadingOne
                ? <ViewLoadingLogo />
                : <ProCard
                    title="Id"
                    extra={store.item.id}
                    headerBordered
                    split="horizontal"
                >
                    <ProCard title="Title" >
                        <Typography.Title level={3}>{store.item.title}</Typography.Title>
                    </ProCard>
                    <ProCard title="Description" >
                        {store.item.description}
                    </ProCard>
                    <ProCard title="Questionnaire" >
                        <Markdown>{store.item.questionnaire}</Markdown>
                    </ProCard>
                    {store.item.toStatsNote && <ProCard title="Statictics Categories" >
                        <Markdown>{store.item.toStatsNote}</Markdown>
                    </ProCard>}
                    <ProCard split="vertical">
                        <ProCard title="Status">
                            <Tag color={store.item.status == "Active" ? "green" : "red"}>
                                {store.item.status}
                            </Tag>
                        </ProCard>
                        <ProCard title="Created At">
                            {utilDtStr("full", store.item.createdAt)}
                        </ProCard>
                        <ProCard title="Updated At">
                            {utilDtStr("full", store.item.updatedAt)}
                        </ProCard>
                    </ProCard>
                </ProCard>
            }

        </ViewPageContainer>
    );
});

export default SurveyIdRespondent;
