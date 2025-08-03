import { ProCard } from "@ant-design/pro-components";
import { Spin } from "antd";
import { hocViewBasicStats } from "./store";
import { ViewChart } from "./view.chart";
import { ViewTable } from "./view.table";


const ViewBasicStats = hocViewBasicStats(({ store }) => {
    return (
        <Spin spinning={store.isLoading}>
            <ProCard
                bordered
                title={store.titleSub.title}
                subTitle={store.titleSub.sub + ` (Total: ${store.totalItems.toLocaleString()})`}
            >
                {store.chartType == "table" ? <ViewTable /> : <ViewChart />}
            </ProCard>
        </Spin>

    );
});

export default ViewBasicStats;
