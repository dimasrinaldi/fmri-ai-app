import { EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { MetaFunction } from "@remix-run/node";
import { Button, Dropdown, Flex, Input, Segmented, Space, Table, TableColumnsType, Tag, Typography } from "antd";
import { getDataApp, TAppId } from "~/data/data.app";
import { TSortDirectionId } from "~/data/data.sort-direction";
import PageContainer from "~/routes/_app/view.page-container";
import { ArrayElement } from "~/types";
import { utilDtStr } from "~/util/util.dt-str";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocAdminUserList } from "./store";
import { Outlet } from "@remix-run/react";
import { dataItemStatus, TItemStatusId } from "~/data/data.item-status";

const pageTitle = "List of Users";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const AdminUserList = hocAdminUserList(({ store }) => {
    type ItemType = ArrayElement<typeof store.items>;
    const columns: TableColumnsType<ItemType> = [
        {
            title: "Username",
            dataIndex: "username",
            sorter: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (value: TItemStatusId) => <Tag color={value == "Active" ? "success" : "error"}>{value}</Tag>,
            sorter: true
        },
        {
            title: "Client",
            dataIndex: "clientName",
            sorter: true,
        },
        {
            title: "Role",
            dataIndex: "roleName",
            sorter: true,
        },
        {
            title: "Updated at",
            dataIndex: "updatedAt",
            sorter: true,
            render: (value) => utilDtStr("full", value),
        },
        {
            title: "Updated by",
            dataIndex: "updatedBy",
            sorter: true,
        }, {
            title: "Edit",
            align: "center",
            fixed: "right",
            render: (_, { id }) => (
                <Flex align="center" justify="center">
                    <Space.Compact>
                        <Button
                            disabled={id == store.meId}
                            icon={<EditOutlined />}
                            onClick={() => store.onEdit(id)}
                        />
                        <Dropdown
                            trigger={["click"]}
                            placement="bottomRight"
                            arrow={{ pointAtCenter: true }}
                            menu={{
                                items: [
                                    {
                                        key: "reset-password",
                                        label: "Reset Password",
                                        icon: <UndoOutlined />,
                                        disabled: id == store.meId,
                                    },
                                ],
                                onClick: ({ key }) => {
                                    if (key == "reset-password") { store.onResetPassword(id) }
                                },
                            }}
                        >
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
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
                    <Segmented
                        style={{ backgroundColor: "#eee" }}
                        options={dataItemStatus.map((i) => ({
                            value: i.id,
                            label: <Typography.Text type={store.status == i.id ? (i.id == "Active" ? "success" : "danger") : undefined}>{i.id}</Typography.Text>,
                        }))}
                        value={store.status}
                        onChange={(value) => store.onSetStatus(value)}
                    />
                    <Input
                        allowClear
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        value={store.search}
                        onChange={(e) => store.onSetSearch(e.target.value)}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => store.onCreate()}>
                        Add
                    </Button>
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
            <Outlet />
        </PageContainer>
    );
});

export default AdminUserList;
