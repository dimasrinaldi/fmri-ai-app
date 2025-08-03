import { PageContainer, ProCard } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/react";
import { utilMetaTitle } from "~/util/util.meta-title";
import { ViewFeatures } from "~/view/view.features";
import { hocHome } from "./store";
import { getDataApp, TAppId } from "~/data/data.app";
import useVal from "~/use/use.val";
import { Col, Flex, Image, Row, Typography } from "antd";
import { utilPublicEnv } from "~/util/util.public-env";

const pageTitle = "Home";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};
const HomeRoute = hocHome(({ store }) => {

    const readyFeatures = [
        getDataApp("BrandDetection").id
    ]
    const activeFeatures = useVal(() => {
        let result: TAppId[] = ["BrandDetection"]
        result = result.filter((item) => {
            return readyFeatures.includes(item);
        })
        return result;
    });

    let features = useVal(() => {
        let result = [{
            key: getDataApp("BrandDetection").id,
            logo: "/feature-findr-brand.png",
            goto: "/shoe-detection/stats"
        }, {
            key: getDataApp("BrandHealth").id,
            logo: "/feature-fuse-brand.png",
            goto: "/brand-health/dashboard" //TODO: change this

        }, {
            key: getDataApp("SyntheticRespondent").id,
            logo: "/feature-fine-brand.png",
            goto: "/synthetic-respondent/dashboard" // TODO
        }, {
            key: getDataApp("ECommerceAnalytics").id,
            logo: "/feature-fame-brand.png",
            goto: "/e-commerce/dashboard" // TODO
        }].map((item) => {
            return {
                ...item,
                hoverable: activeFeatures.includes(item.key),
                active: activeFeatures.includes(item.key),
            }
        })
        return result;
    })
    const backgroundColor = "#F7F7F7";
    return <PageContainer style={{ backgroundColor }} title={false}>
        <Flex vertical justify="center" align="center" gap="large">
            <ProCard bordered style={{ zIndex: 1 }}>
                <Flex gap="large" align="center" justify="space-between">
                    <div>
                        <Typography.Title level={1}>Welcome {store.profileName}</Typography.Title>
                        <Typography.Title level={5}>
                            Please select and click the features below to start analyzing.
                        </Typography.Title>
                    </div>
                    <Image preview={false} width={120} src="/research-paper.png" />
                </Flex>
            </ProCard>
            <div>
                <div style={{
                    top: 0,
                    bottom: 10,
                    position: "absolute",
                    height: "90vh",
                    width: "95vw",
                    background: `url("/bg-with-logo-line.png")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                }} />
                <Row gutter={[16, 16]}>
                    {features.map((item, index) => {
                        return <Col key={item.key} md={12} xs={24}>
                            <ProCard style={{ opacity: item.active ? 1 : 0.5, zIndex: 1 }}
                                ghost
                                hoverable={item.hoverable}
                                onClick={() => {
                                    if (!item.active) return;
                                    store.goToPage(item.goto)
                                }}
                            >
                                <Image preview={false} width={"100%"} src={item.logo} />
                            </ProCard>
                        </Col>
                    })}
                </Row>
            </div>
        </Flex>
    </PageContainer>;
});

export default HomeRoute;
