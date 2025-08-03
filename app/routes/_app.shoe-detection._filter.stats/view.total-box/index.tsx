import { ProCard } from "@ant-design/pro-components";
import { Flex, Spin, theme } from "antd";
import { hocViewTotalBox } from "./store";
import { ChevronsLeftRightIcon, LucideIcon, TrashIcon, UserIcon } from "lucide-react";
import useVal from "~/use/use.val";
import { CheckCircleTwoTone, FileImageTwoTone, HeartTwoTone, InfoCircleTwoTone, SmileTwoTone, TagTwoTone } from "@ant-design/icons";


const ViewTotalBox = hocViewTotalBox(({ store }) => {
    const { token } = theme.useToken();

    const fontSize = 30;
    const myIcon = useVal(() => {
        const iconMap = {
            id: <TagTwoTone style={{ fontSize }} twoToneColor={token.colorPrimary} />,
            imageName: <FileImageTwoTone style={{ fontSize }} twoToneColor={token.colorPrimary} />
        }
        return (store.col in iconMap ? iconMap[store.col as keyof typeof iconMap] : <InfoCircleTwoTone twoToneColor={token.colorPrimary} />);
    })
    return (
        <Spin spinning={store.isLoading}>
            <ProCard
                bordered
                title={store.titleSub.title}
                subTitle={store.titleSub.sub}
            >
                <Flex justify="center" align="center" gap={"small"}>
                    {myIcon}
                    <div style={{ fontSize }}>{store.totalItems.toLocaleString()}</div>
                </Flex>
            </ProCard>
            {/* <StatisticCard
                bordered
                statistic={{
                    title: store.titleSub.title,
                    description: store.titleSub.sub,
                    value: store.totalItems,
                    valueStyle: {
                        fontSize: 100
                    },
                    icon: <img
                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                        alt="icon"
                    />
                }}
            /> */}
        </Spin>

    );
});

export default ViewTotalBox;
