import { ProCard } from "@ant-design/pro-components";
import { Spin } from "antd";
import ReactECharts from "echarts-for-react";
import millify from "millify";
import { hocViewBomo } from "./store";
import { format } from "path";


const ViewBomo = hocViewBomo(({ store }) => {
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
                            right: "8%",
                            bottom: "0%",
                            left: "0%",
                            containLabel: true,
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: (params) => {
                                const value = params.value;
                                const percent = value + "%";
                                return `${params.name} ${percent}`;
                            }
                        },
                        series: [
                            {
                                type: "pie",
                                colorBy: "data",
                                data: store.echartData.series,
                            },
                        ],
                    }}
                />
            </Spin>
        </ProCard>

    );
});

export default ViewBomo;
