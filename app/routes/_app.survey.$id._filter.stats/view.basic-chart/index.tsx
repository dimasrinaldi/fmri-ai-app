import { ProCard } from "@ant-design/pro-components";
import { Spin } from "antd";
import ReactECharts from "echarts-for-react";
import millify from "millify";
import { hocViewBasicStats } from "./store";


const ViewBasicStats = hocViewBasicStats(({ store }) => {

    return (
        <ProCard
            bordered
            title={store.titleSub.title}
            subTitle={store.titleSub.sub}
        >
            <Spin spinning={store.isLoading}>
                <ReactECharts
                    style={{
                        ...(store.height ? { height: store.height } : {})
                    }}
                    option={{
                        grid: {
                            top: 0,
                            right: 10,
                            bottom: "10%",
                            left: "3%",
                            containLabel: true,
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: ({ data }) => {
                                return `${millify(data.value)} (${millify(data.percent)}%)`;
                            }
                        },
                        ...(store.chartType != "bar" ? {} : {
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
                                        position: "inside",
                                        formatter: ({ value, data }) => {
                                            return `${millify(data.percent)}% (${millify(value)})`;
                                        }
                                    },
                                },
                            ]
                        }),
                        ...(store.chartType != "pie" ? {} : {
                            legend: {
                                orient: 'horizontal',
                                bottom: 0
                            },
                            series: [
                                {
                                    name: 'Access From',
                                    type: 'pie',
                                    radius: '75%',
                                    data: store.echartData.dataSeries,
                                    emphasis: {
                                        itemStyle: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ],
                        })

                    }}
                />
            </Spin>
        </ProCard>

    );
});

export default ViewBasicStats;
