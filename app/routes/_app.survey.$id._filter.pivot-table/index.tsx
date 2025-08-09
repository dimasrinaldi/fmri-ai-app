import { MetaFunction } from "@remix-run/react";
import { Empty, Flex, Segmented, Select, Space, Table, Typography } from "antd";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewPageContainer from "../_app.survey.$id._filter/view.page-container";
import { dataPivotType, TPivotTypeId } from "./data.pivot-type";
import { hocSurveyIdPivotTable } from "./store";

const pageTitle = "Survey Pivot Table";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};
const SurveyIdPivotTable = hocSurveyIdPivotTable(({ store }) => {
    return (
        <ViewPageContainer
            showAi
            title={pageTitle}
        >
            <Flex gap={"small"} justify="space-between" align="center" wrap>
                <Typography.Text style={{ maxWidth: 600 }}>
                    Create a pivot table using the
                    available rows and columns to analyze and present
                    the data in a more structured way.
                    The numbers provided in the table represent the number
                    of respondents related to the total of <b>{store.totalPerson}.</b>
                </Typography.Text>
                <Space wrap>
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
                        options={store.typeOptions.filter(i => i.value != "personName")}
                        onSelect={store.onSelectCol}
                    />
                    <Segmented<TPivotTypeId>
                        value={store.pivotType}
                        options={dataPivotType.map(i => ({ value: i.id, label: i.label }))}
                        onChange={value => store.onSetPivotType(value)}
                    />
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
                    columns={[{
                        title: "No", dataIndex: "row",
                        render: (i, obj) => obj.id + 1
                    }, ...store.tableColOptions]}
                    dataSource={store.displayedPivotItems}
                />
            </Flex>
        </ViewPageContainer>

    );
});

export default SurveyIdPivotTable;
