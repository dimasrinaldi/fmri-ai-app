import { Card, Flex, Skeleton, Space } from "antd";
import { observer } from "mobx-react";
import RouteContent from "~/components/RouteContent";

const ViewLoadingPage = observer(() => (
    <RouteContent>
        <Skeleton active title={{ width: 300 }} paragraph={false} />
        <Flex align="center" justify="space-between" gap={"small"}>
            <Space>
                <Skeleton.Input active />
            </Space>
            <Space>
                <Skeleton.Button active />
            </Space>
        </Flex>
        <Card size="small">
            <Skeleton active title={{ width: "100%" }} paragraph={{ rows: 10, width: "100%" }} />
        </Card>
        <Flex align="center" justify="flex-end">
            <Skeleton active title={false} paragraph={{ rows: 1, width: "100%" }} style={{ width: 400 }} />
        </Flex>
    </RouteContent>
));

export default ViewLoadingPage;
