import { PlusOutlined } from "@ant-design/icons";
import { PageContainerProps } from "@ant-design/pro-components";
import { Button, Flex, Popover, Select, Tag } from "antd";
import { Filter, FilterX } from "lucide-react";
import { observer } from "mobx-react";
import { useSurveyIdFilterStore } from "./store";
import ViewPageSurveyIdContainer from "../_app.survey.$id/view.page-container"

interface Props extends PageContainerProps {
    showAi?: boolean;
    children: React.ReactNode;
}
const ViewPageContainer = observer((props: Props) => {
    const store = useSurveyIdFilterStore();
    const { extra, ...extProps } = props;
    return <ViewPageSurveyIdContainer
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
                    <Select placeholder="Add Filter"
                        prefix={<PlusOutlined />}
                        value={null}
                        showSearch
                        options={store.typeValueOptions}
                        onSelect={store.onSelectVal}
                        disabled={store.selValDisabled}
                        allowClear
                    />
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
