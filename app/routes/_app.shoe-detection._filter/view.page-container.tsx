import { PlusOutlined } from "@ant-design/icons";
import { PageContainerProps } from "@ant-design/pro-components";
import { Button, Checkbox, Divider, Flex, Input, Menu, Popover, Select, Space, Spin, Tag } from "antd";
import { Filter, FilterX } from "lucide-react";
import { observer } from "mobx-react";
import { useShoeDetectionFilterStore } from "./store";
import ViewMyPageContainer from "../_app.shoe-detection/view.page-container"

interface Props extends PageContainerProps {
    showAi?: boolean;
    children: React.ReactNode;
}
const ViewPageContainer = observer((props: Props) => {
    const store = useShoeDetectionFilterStore();
    const { extra, ...extProps } = props;
    return <ViewMyPageContainer
        {...extProps}
        extra={<Flex wrap gap={"small"} align="center">
            {store.filterWithLabel.map(i => {
                return <Flex className="stats-filter-item" wrap={false} gap={"small"} key={i.col}>
                    {i.label}: <Flex gap={"small"} wrap >
                        {i.vals.map(val => <Tag
                            style={{ margin: 0 }} key={val} closable
                            onClose={() => store.onRemoveFilter(i.col, val)}
                        >
                            {val}
                        </Tag>)}
                    </Flex>
                </Flex>
            })}
            <Popover
                placement="bottomRight"
                content={<Flex gap={"small"}
                    style={{ width: 200 }}
                    vertical
                >
                    {store.filter.length > 0 && (
                        <Button block onClick={store.onClearFilter} icon={<FilterX />}>
                            Clear all filters
                        </Button>
                    )}
                    <Select placeholder="Type"
                        value={store.selectedCol || undefined}
                        showSearch
                        options={store.typeOptions}
                        onSelect={store.onSelectCol}
                    />
                    <Input allowClear onClear={() => store.onSelectFilterValSearch("")} placeholder="Filter" value={store.filterValSearch} onChange={(e) => store.onSelectFilterValSearch(e.target.value)} />
                    <Spin spinning={store.isFilterLoading}>
                        <Space
                            style={{
                                width: "100%",
                                maxHeight: 200,
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                            direction="vertical" split={<Divider type="horizontal" style={{ padding: 0, margin: 0 }} />}
                        >
                            {store.typeValueOptions.map((i, ix) => {
                                return <Checkbox
                                    style={{ width: "100%" }}
                                    onChange={e => store.onSelectVal(i.value)}
                                    checked={i.checked} key={i.value}
                                >{i.value}</Checkbox>
                            })}
                        </Space>
                    </Spin>

                    {/* <Select placeholder="Add Filter"
                        prefix={<PlusOutlined />}
                        value={null}
                        showSearch
                        options={store.typeValueOptions}
                        onSelect={store.onSelectVal}
                        disabled={store.selValDisabled}
                        allowClear
                    /> */}
                </Flex>}
                trigger="click"
            >
                <Button icon={<Filter />} >Filter</Button>
            </Popover>
            {extra}
        </Flex >}
    />
});

export default ViewPageContainer;
