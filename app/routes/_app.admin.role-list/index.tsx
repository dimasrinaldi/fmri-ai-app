import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { MetaFunction } from "@remix-run/node";
import { Button, Flex, Input, Modal, Space, Table, TableColumnsType, Tag, Tooltip } from "antd";
import { getDataAcl, TAclId } from "~/data/data.acl";
import { TSortDirectionId } from "~/data/data.sort-direction";
import PageContainer from "~/routes/_app/view.page-container";
import { ArrayElement } from "~/types";
import { utilDtStr } from "~/util/util.dt-str";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocAdminRoleList } from "./store";

const pageTitle = "List of Roles";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const AdminhocAdminRoleList = hocAdminRoleList(({ store }) => {
    type ItemType = ArrayElement<typeof store.items>;
    const columns: TableColumnsType<ItemType> = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Access Control List (ACL)",
            dataIndex: "acl",
            render: (value: TAclId[]) => {
                const expandedAcl = value;
                return expandedAcl.length == 0 ? "All features" : (
                    <>
                        {expandedAcl.slice(0, 3).map((i) => <Tag key={i}>{getDataAcl(i).id}</Tag>)}
                        {expandedAcl.length > 3 && (
                            <Tooltip title={expandedAcl.slice(3).map((i) => getDataAcl(i).id).join(", ")}>
                                <Tag>+ {expandedAcl.length - 3}</Tag>
                            </Tooltip>
                        )}
                    </>
                );
            },
        },
        {
            title: "Updated at",
            dataIndex: "updatedAt",
            sorter: true,
            sortDirections: ["descend", "ascend"],
            render: (value) => utilDtStr("full", value),
        },
        {
            title: "Updated by",
            dataIndex: "updatedBy",
            sorter: true,
        }, {
            title: "Detail",
            align: "center",
            fixed: "right",
            render: (_, { id }) => (
                <Flex align="center" justify="center">
                    <Space.Compact>
                        <Button
                            icon={<InfoCircleOutlined />}
                            onClick={() => store.onSetDetailId(id)}
                        />
                    </Space.Compact>
                </Flex>
            ),
        }
    ];

    return (
        <PageContainer
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
            {store.detail && <Modal
                title={store.detail.name}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={true}
                onCancel={() => store.onSetDetailId("")}
                cancelText="Close"
                footer={false}
            >
                <Table
                    columns={[{
                        title: "Access",
                        dataIndex: "id"
                    }, {
                        title: "Description",
                        dataIndex: "describe"
                    }]}
                    key={"id"}
                    dataSource={store.detail.describes}
                />
            </Modal>}
        </PageContainer>
    );
});

export default AdminhocAdminRoleList;
