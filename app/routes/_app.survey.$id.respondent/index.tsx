import { SearchOutlined } from "@ant-design/icons";
import { MetaFunction } from "@remix-run/node";
import { Flex, Input, Space, Table, TableColumnsType } from "antd";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { ArrayElement } from "~/types";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewPageContainer from '../_app.survey.$id/view.page-container';
import { hocSurveyIdRespondent } from "./store";


const pageTitle = "List of Respondent";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const SurveyIdRespondent = hocSurveyIdRespondent(({ store }) => {
    type ItemType = ArrayElement<typeof store.items>;
    const columns: TableColumnsType<ItemType> = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
        },
        {
            title: "City",
            dataIndex: "city",
            sorter: true,
        },
        {
            title: "Gender",
            dataIndex: "gender",
            sorter: true,
        },
        {
            title: "Age",
            dataIndex: "age",
            sorter: true,
        },
        {
            title: "Occupation",
            dataIndex: "occupation",
            sorter: true,
        },
        {
            title: "Marital Status",
            dataIndex: "maritalStatus",
            sorter: true,
        },
        {
            title: "SEC",
            dataIndex: "sec",
            sorter: true,
        },
    ];

    return (
        <ViewPageContainer
            title={pageTitle}
            extra={<Flex align="center" justify="space-between" gap={"small"}>
                <Space>
                    <Input
                        allowClear
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        value={store.search}
                        onChange={(e) => store.onSetSearch(e.target.value)}
                    />
                </Space>
            </Flex>}
        >
            <Table
                size="middle"
                bordered
                scroll={{ x: true }}
                showSorterTooltip={{ mouseLeaveDelay: 0 }}
                pagination={{
                    size: "default",
                    showSizeChanger: true,
                    total: store.count,
                    current: store.page + 1,
                    pageSize: store.limit,
                    pageSizeOptions: [5, 10, 50, 100],
                    showTotal: (total, [start, end]) => `${start}-${end} of ${total}`,
                }}
                style={{ whiteSpace: "nowrap" }}
                loading={store.isListLoading}
                rowKey="id"
                columns={columns}
                dataSource={store.items}
                onChange={(pagination, filters, sorter: any, { action }) => {
                    if (action == "paginate") {
                        const { current: page, pageSize: size } = pagination;
                        store.onSetPagination((page ?? 0) - 1, size ?? 0);
                    } else if (action == "sort") {
                        let sortBy = "id";
                        let sortDirection: TSortDirectionId = "desc";

                        if (sorter.column) {
                            sortBy = sorter.field;
                            sortDirection = sorter.order == "descend" ? "desc" : "asc";
                        }

                        store.onSetSort(sortBy, sortDirection);
                    }
                }}
            />
        </ViewPageContainer>
    );
});

export default SurveyIdRespondent;
