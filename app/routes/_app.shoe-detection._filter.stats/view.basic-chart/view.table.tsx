import { Progress, Table, theme } from "antd";
import Gradient from "javascript-color-gradient";
import { observer } from "mobx-react";
import useVal from "~/use/use.val";
import { useViewBasicStatsStore } from "./store";

export const ViewTable = observer(() => {
    const store = useViewBasicStatsStore();
    const { token } = theme.useToken();
    const colorGradients = useVal(() => {
        const midPoint = store.items.length < 10 ? 10 : store.items.length;
        const gradientArray = new Gradient()
            .setColorGradient(token.colorPrimary, "#0E2954")
            .setMidpoint(midPoint)
            .getColors();
        return gradientArray
    })
    return <Table
        size="small"
        rowKey={"num"}
        columns={[
            {
                title: "Model",
                dataIndex: "category",
                render(value, record, index) {
                    return <div style={{ textWrap: "nowrap" }}>{value}</div>
                },
            },
            {
                width: 500,
                title: "Bar",
                dataIndex: "percProgress",
                render(value, record, index) {
                    return <Progress
                        showInfo={false}
                        percent={value}
                        percentPosition={{ align: 'center', type: 'inner' }}
                        size={["100%", 20]}
                        strokeColor={colorGradients[index]}
                    />
                },
            },
            {
                title: "Percentage",
                dataIndex: "perc",
                render(value, record, index) {
                    return `${value} %`
                },
            },
            {
                title: "Count",
                dataIndex: "itemCount",
                render(value, record, index) {
                    return value.toLocaleString()
                },
            }
        ]}
        dataSource={store.itemsTable}
    />
})