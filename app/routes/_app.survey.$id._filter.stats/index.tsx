import { MetaFunction } from "@remix-run/node";
import { createStyles } from "antd-style";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewPageContainer from "../_app.survey.$id._filter/view.page-container";
import { hocSurveyIdStats } from "./store";
import ViewBasicStats from "./view.basic-chart";
import useResponsiveWidth from "~/use/use.responsive-width";
import { Space } from "antd";

const pageTitle = "General Statistics";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const SurveyIdStats = hocSurveyIdStats(({ store }) => {
    const { ref, width } = useResponsiveWidth({ lg: 2 })
    const { styles } = useStyles({ width });
    return (
        <ViewPageContainer
            showAi
            title={pageTitle}
        >
            <Space align="center" size={10}
                wrap className={styles.boxLayout}
                style={{ width: "100%" }} ref={ref}
            >{width != "auto" && <>
                <ViewBasicStats
                    title="Answer"
                    description="Answers given to the survey"
                    chart="bar"
                    col="answerContent"
                />
                <ViewBasicStats
                    title="Person's Gender"
                    description="Gender of people who responded to the survey"
                    chart="bar"
                    col="personGender"
                />
                <ViewBasicStats
                    title="Person's Age"
                    description="Age of people who responded to the survey"
                    chart="bar"
                    col="personAge"
                />
                <ViewBasicStats
                    title="Person's City"
                    description="City of people who responded to the survey"
                    chart="bar"
                    col="personCity"
                />
            </>}
            </Space>

        </ViewPageContainer>
    );
});

export default SurveyIdStats;

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

