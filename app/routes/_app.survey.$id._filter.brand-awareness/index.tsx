import { MetaFunction } from "@remix-run/node";
import { Space, Typography } from "antd";
import { createStyles } from "antd-style";
import useResponsiveWidth from "~/use/use.responsive-width";
import { utilMetaTitle } from "~/util/util.meta-title";
import ViewSurveyIdFilterPage from "../_app.survey.$id._filter/view.page-container";
import { hocSurveyIdBrandAwareneness } from "./store";
import ViewAwareness from "./view.awareness";
import ViewBomo from "./view.bumo";
import ViewSpont from "./view.spont";
import ViewTom from "./view.tom";
const { Text } = Typography

const pageTitle = "Brand Awareness";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const SurveyIdBrandAwarenessRoute = hocSurveyIdBrandAwareneness(({ store }) => {
    const { ref, width } = useResponsiveWidth({ lg: 2 })
    const { styles } = useStyles({ width });
    return (
        <ViewSurveyIdFilterPage
            showAi
            title={pageTitle}
        >
            <Space ref={ref} align="center" size={10}
                wrap className={styles.boxLayout}
            >
                <ViewTom />
                <ViewSpont />
                <ViewAwareness />
                <ViewBomo />
            </Space>
        </ViewSurveyIdFilterPage>
    );
});

export default SurveyIdBrandAwarenessRoute;

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

