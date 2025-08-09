import { ProCard } from "@ant-design/pro-components";
import { Spin } from "antd";
import ReactECharts from "echarts-for-react";
import millify from "millify";
import { hocViewTom } from "./store";


const ViewTom = hocViewTom(({ store }) => {

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
                        tooltip: { trigger: "item" },
                        xAxis: {
                            type: "value",
                        },
                        yAxis: {
                            type: "category",
                            inverse: true,
                            data: store.echartData.categories,
                            axisLabel: {
                                width: 150,
                                overflow: "truncate",
                            },
                        },
                        series: [
                            {
                                type: "bar",
                                colorBy: "data",
                                data: store.echartData.dataSeries,
                                label: {
                                    show: true,
                                    position: "right",
                                    formatter: ({ value }) => millify(value) + " %",
                                },
                            },
                        ],
                    }}
                />
            </Spin>
        </ProCard>

    );
});

export default ViewTom;
