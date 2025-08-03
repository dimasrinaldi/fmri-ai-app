import { PageContainerProps } from "@ant-design/pro-components";
import { observer } from "mobx-react";
import PageContainer from "~/routes/_app/view.page-container";

interface Props extends PageContainerProps {
    showAi?: boolean;
    children: React.ReactNode;
}
const ViewPageContainer = observer((props: Props) => {
    return (
        <PageContainer
            {...props}
        >
            {props.children}
        </PageContainer>
    )
});

export default ViewPageContainer;
