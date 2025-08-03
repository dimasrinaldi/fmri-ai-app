import { MetaFunction } from "@remix-run/node";
import { Col, Row, Space } from "antd";
import { createStyles } from "antd-style";
import useResponsiveWidth from "~/use/use.responsive-width";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewPageContainer from "../_app.shoe-detection._filter/view.page-container";
import { hocShoeDetectionStats } from "./store";
import ViewBasicStats from "./view.basic-chart";
import ViewTotalBox from "./view.total-box";

const pageTitle = "Statistics";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const ShoeDetectionEventIdStats = hocShoeDetectionStats(({ store }) => {
    const { ref, width } = useResponsiveWidth({ lg: 2 })
    const { styles } = useStyles({ width });
    return (
        <ViewPageContainer
            title={pageTitle}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <ViewTotalBox
                        title="Total Data"
                        description="Total number of records in the dataset"
                        col="id"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewTotalBox
                        title="Total Photo"
                        description="Total number of photos uploaded into the system"
                        col="imageName"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Brand"
                        description="Top used brands"
                        col="brand"
                        chart="pie"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Gender"
                        description="Gender of shoe wearers"
                        col="gender"
                        chart="pie"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Model"
                        description="Top used shoe models"
                        col="model"
                        chart="table"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Color"
                        description="Top used shoe colors"
                        col="color"
                        chart="table"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Speed"
                        description="Time taken (in minutes) per KM"
                        col="minuteKm"
                        chart="bar"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Distance"
                        description="Running distance"
                        col="distance"
                        chart="pie"
                    />
                </Col>

                {/* <Col xs={24} md={12}>
                    <ViewBasicStats
                        title="Podium"
                        description="Whether the photo was taken on podium"
                        col="podium"
                        chart="pie"
                    />
                </Col> */}
                <Col xs={24} md={24}>
                    <ViewBasicStats
                        title="Event"
                        description="Running event names"
                        col="event"
                        chart="table"
                    />
                </Col>
                {store.access.featurePrivileged && <Col xs={24}>
                    <ViewBasicStats
                        title="Data Status"
                        description="Whether the data has been edited"
                        col="dataStatus"
                        chart="table"
                    />
                </Col>}
            </Row>
        </ViewPageContainer>
    );
});

export default ShoeDetectionEventIdStats;

const useStyles = createStyles(({ css, token, prefixCls }, arg: { width: number | "auto" }) => {
    return {
        boxLayout: {
            justifyContent: "center",
            [`.${prefixCls}-pro-card`]: {
                width: typeof arg.width == "string" ? arg.width : arg.width - 10,
            },
        }
    }
});

