import { PageContainerProps } from "@ant-design/pro-components";
import { observer } from "mobx-react";
import PageContainer from "~/routes/_app/view.page-container";
import { useSurveyIdStore } from "./store";
import { BotIcon, Users2Icon } from "lucide-react";
import { Flex } from "antd";

interface Props extends PageContainerProps {
    showAi?: boolean;
    children: React.ReactNode;
}
const ViewPageContainer = observer((props: Props) => {
    const store = useSurveyIdStore();
    return (
        <PageContainer
            {...props}
            breadcrumb={{
                items: [{
                    href: "/survey/list",
                    title: "Survey",
                }, {
                    title: <Flex gap="small">
                        {store.respondentType == "Real" ? <Users2Icon color="green" /> : <BotIcon color="red" />}
                        {store.respondentType}
                    </Flex>
                }, {
                    title: store.surveyTitle
                }]
            }}
        >
            {props.children}
        </PageContainer>
    )
});

export default ViewPageContainer;
