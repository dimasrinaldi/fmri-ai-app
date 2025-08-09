import { ProCard } from "@ant-design/pro-components";
import ReactECharts from "echarts-for-react";
import millify from "millify";
import { hocViewAwareness } from "./store";
import { Spin } from "antd";


const ViewAwareness = hocViewAwareness(({ store }) => {
    return (
        <ProCard
            bordered
            title={store.titleSub.title}
            subTitle={store.titleSub.sub}
        >
            <Spin spinning={store.isLoading}>
                <ReactECharts
                    option={{
                        grid: {
                            top: "0%",
                            right: "4%",
                            bottom: "10%",
                            left: "3%",
                            containLabel: true,
                        },
                        legend: {
                            selectedMode: false,
                            bottom: 0
                        },
                        tooltip: { trigger: "item" },
                        xAxis: {
                            type: "value",
                            boundaryGap: [0, "5%"],
                            axisLabel: { formatter: (value: number) => millify(value) },
                        },
                        yAxis: {
                            type: "category",
                            inverse: true,
                            data: store.echartData.categories,
                        },
                        series: store.echartData.dataSeries,
                    }}
                />
            </Spin>
        </ProCard>

    );
});

export default ViewAwareness;
