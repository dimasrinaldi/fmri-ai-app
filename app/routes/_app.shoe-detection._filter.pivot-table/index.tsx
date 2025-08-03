import { MetaFunction } from "@remix-run/react";
import { Button, Empty, Flex, Segmented, Select, Space, Table, Tooltip, Typography } from "antd";
import { utilMetaTitle } from "~/util/util.meta-title";
import { dataPivotType, TPivotTypeId } from "./data.pivot-type";
import { hocShoeDetectionPivotTable } from "./store";
import ViewPageContainer from "../_app.shoe-detection._filter/view.page-container";
import { DownloadCloudIcon } from "lucide-react";

const pageTitle = "Survey Pivot Table";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};
const ShoeDetectionPivotTable = hocShoeDetectionPivotTable(({ store }) => {
    return (
        <ViewPageContainer
            showAi
            title={pageTitle}
        >
            <Flex gap={"small"} vertical>
                <Typography.Text>
                    Create a pivot table using the
                    available rows and columns to analyze and present
                    the data in a more structured way.
                    The numbers provided in the table represent the number
                    of respondents related to the total of <b>{store.totalItems.toLocaleString()}.</b>
                </Typography.Text>
                <Space>
                    <Select
                        prefix="Row: "
                        placeholder="select"
                        value={store.selectedRow || undefined}
                        showSearch
                        options={store.typeOptions}
                        onSelect={store.onSelectRow}
                    />
                    <Select
                        prefix="Column: "
                        placeholder="select"
                        value={store.selectedCol || undefined}
                        showSearch
                        options={store.typeOptions}
                        onSelect={store.onSelectCol}
                    />
                    <Segmented<TPivotTypeId>
                        value={store.pivotType}
                        options={dataPivotType.map(i => ({ value: i.id, label: i.label }))}
                        onChange={value => store.onSetPivotType(value)}
                    />
                    <Tooltip placement="topRight" title="Download CSV data">
                        <Button onClick={() => store.onDownloadData()} icon={<DownloadCloudIcon />} />
                    </Tooltip>
                </Space>
            </Flex>
            <Flex style={{
                marginTop: 16,
            }} justify="center" >
                <Table
                    bordered
                    loading={store.isLoading}
                    pagination={false}
                    scroll={{ x: true }}
                    size="middle"
                    style={{
                        width: "100%",
                        whiteSpace: "nowrap"
                    }}
                    rowKey="id"
                    columns={store.tableColOptions.map(i => ({
                        ...i,
                        render: i.dataIndex == "row"
                            ? (i, obj: any) => obj.id + 1
                            : (i: number | string) => typeof i == "number" ? i.toLocaleString() : i
                    }))}
                    dataSource={store.displayedPivotItems}
                />
            </Flex>
        </ViewPageContainer>

    );
});

export default ShoeDetectionPivotTable;
