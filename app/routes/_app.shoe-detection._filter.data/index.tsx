import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Button, Flex, Image, Input, Space, Table, TableColumnsType, Tag, Tooltip } from "antd";
import _ from "lodash";
import { DownloadCloudIcon, FileDownIcon } from "lucide-react";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { ArrayElement } from "~/types";
import { utilMetaTitle } from "~/util/util.meta-title";
import { dataColFilter } from "../_app.shoe-detection._filter/data.col-filter";
import ViewPageContainer from "../_app.shoe-detection._filter/view.page-container";
import { dataColSearch } from "./data.col.search";
import { hocShoeDetectionData } from "./store";

const pageTitle = "Data";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const ShoeDetectionData = hocShoeDetectionData(({ store }) => {
    type ItemType = ArrayElement<typeof store.items>;
    const columns: TableColumnsType<ItemType> = [{
        dataIndex: "imageUrl",
        title: "Image",
        sorter: false,
        render: (value, item) => {
            return <Flex justify="center"><Image
                style={{ objectFit: "cover" }}
                src={item.thumbnail} alt={item.id} width={50} height={30}
                preview={{
                    src: value,
                    imageRender(originalNode, info) {
                        return <>
                            <Space wrap size="small" style={{
                                position: "fixed",
                                zIndex: 1,
                                opacity: 0.5,
                            }}>
                                {[{ id: "runningNum", label: "BIB" }, ...dataColFilter].map(i => {
                                    return <Tag key={i.id}>
                                        {item[i.id as keyof typeof item]}
                                    </Tag>
                                })}
                            </Space>
                            {originalNode}
                        </>;
                    },
                }}
            /></Flex>
        }
    },
    { dataIndex: "runningNum", title: "BIB", sorter: true },
    ...dataColSearch.map(i => ({
        title: _.startCase(i.id).split(" ").join(""),
        dataIndex: i.id,
        sorter: true,
        hidden: ["dataStatus"].includes(i.id) ? !store.access.featurePrivileged : false
    })), {
        title: "Updated By",
        dataIndex: "updatedBy",
        hidden: !store.access.featurePrivileged
    },
    {
        title: "Edit",
        align: "center",
        hidden: !store.access.featurePrivileged,
        fixed: "right",
        render: (_, { id }) => (
            <Flex align="center" justify="center">
                <Button
                    icon={<EditOutlined />}
                    onClick={() => store.onEdit(id)}
                />
            </Flex>
        ),
    }]

    return <ViewPageContainer
        title={pageTitle}
        extra={<Flex align="center" justify="space-between" gap={"small"}>
            <Input
                allowClear
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={store.search}
                onChange={(e) => store.onSetSearch(e.target.value)}
            />
            <Tooltip placement="topRight" title="Download all CSV data">
                <Button loading={store.csvLoading} onClick={() => store.onDownloadAllData()} icon={<DownloadCloudIcon />} />
            </Tooltip>
            <Tooltip placement="topRight" title="Download page CSV data">
                <Button onClick={() => store.onDownloadData()} icon={<FileDownIcon />} />
            </Tooltip>
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
    </ViewPageContainer>
});

export default ShoeDetectionData;
