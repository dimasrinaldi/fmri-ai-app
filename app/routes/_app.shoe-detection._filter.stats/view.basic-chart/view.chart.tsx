import { theme } from "antd";
import ReactECharts from "echarts-for-react";
import millify from "millify";
import { observer } from "mobx-react";
import Gradient from "javascript-color-gradient";
import useVal from "~/use/use.val";
import { useViewBasicStatsStore } from "./store";

export const ViewChart = observer(() => {
    const store = useViewBasicStatsStore();
    const { token } = theme.useToken();
    const colorGradients = useVal(() => {
        const midPoint = store.items.length < 10 ? 10 : store.items.length;
        const gradientArray = new Gradient()
            .setColorGradient(token.colorPrimary, "#0E2954")
            .setMidpoint(midPoint)
            .getColors();
        return gradientArray;
    })
    return <ReactECharts
        style={{
            ...(store.height && { height: store.height })
        }}
        option={{
            tooltip: {
                trigger: "item",
                formatter: ({ data }: { data: { name: string; value: number; percent: number } }) => {
                    return `${data.name}: ${millify(data.value)} (${millify(data.percent)}%)`;
                }
            },
            ...(store.chartType != "bar" ? {} : {
                grid: {
                    top: 0,
                    right: 50,
                    bottom: "10%",
                    left: "3%",
                    containLabel: true,
                },
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
                            position: "outside",
                            formatter: ({ value, data }: { value: number, data: any }) => {
                                return `${millify(data.percent)}% (${millify(value)})`;
                            }
                        },
                        itemStyle: {
                            color: (obj: any) => {
                                const name = obj.name ?? "";
                                const nameIndex = store.items.findIndex((item) => item.category == name);
                                return colorGradients[nameIndex]
                            },
                        },
                    },
                ]
            }),
            ...(store.chartType != "pie" ? {} : {
                grid: {
                    top: 100,
                    right: 100,
                    bottom: 100,
                    left: 1000,
                    containLabel: true,
                },
                legend: {
                    show: false,
                    orient: 'horizontal',
                    bottom: 0,
                    textStyle: {
                        color: "white"
                    }
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
                        },
                        itemStyle: {
                            color: (obj: any) => {
                                const name = obj.name ?? "";
                                const nameIndex = store.items.findIndex((item) => item.category == name);
                                return colorGradients[nameIndex]
                            },
                        },
                        label: {
                            formatter: ({ value, data }: { value: number, data: { name: string, percent: number } }) => {
                                return `${data.name} ( ${millify(data.percent)}% )`;
                            }
                        },
                    }
                ],
            })

        }}
    />
})