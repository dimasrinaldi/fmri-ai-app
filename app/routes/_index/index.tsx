import { LoginOutlined } from "@ant-design/icons";
import { ProCard, ProLayout } from "@ant-design/pro-components";
import { MetaFunction } from "@remix-run/node";
import { Button, Col, Flex, Image, Row, Typography } from "antd";
import { getDataApp } from "~/data/data.app";
import usePublicEnv from "~/use/use.publicEnv";
import useVal from "~/use/use.val";
import { utilMetaTitle } from "~/util/util.meta-title";
import { hocIndex } from "./store";

const pageTitle = "Application";
export const meta: MetaFunction = () => {
    return [{
        title: utilMetaTitle({ title: pageTitle }),
    }];
};

const IndexRoute = hocIndex(({ store }) => {
    const env = usePublicEnv()
    let features = useVal(() => {
        let result = [{
            key: getDataApp("BrandDetection").id,
            logo: "/feature-findr.png",
            goto: "/shoe-detection/stats"
        }, {
            key: getDataApp("BrandHealth").id,
            logo: "/feature-fuse.png",
            goto: "/brand-health/dashboard" //TODO: change this

        }, {
            key: getDataApp("SyntheticRespondent").id,
            logo: "/feature-fine.png",
            goto: "/synthetic-respondent/dashboard" // TODO
        }, {
            key: getDataApp("ECommerceAnalytics").id,
            logo: "/feature-fame.png",
            goto: "/e-commerce/dashboard" // TODO
        }]
        return result;
    })
    return (
        <ProLayout
            logo={env.logoPath}
            title={false}
            layout="top"
            actionsRender={() => (<Flex style={{ marginRight: 20 }}>
                <Button onClick={() => store.onToLogin()} type="primary" icon={<LoginOutlined />}>Login</Button>
            </Flex>)}
            disableMobile={true}
        >
            <Flex vertical justify="center" align="center" gap="large">
                <ProCard>
                    <Flex gap="large" align="center">
                        <div>
                            <Typography.Title level={1}>Welcome to {env.appName} !</Typography.Title>

                            <Typography.Paragraph>
                                {env.appName} is a smart ecosystem of research tools designed to help brands
                                evaluate, validate, and visualize how their ideas and products live in the real
                                world. Our platform combines cutting-edge AI technology with comprehensive data analysis
                                to deliver actionable insights for your business decisions.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                With {env.appName}, you can gain a deeper understanding of your target audience,
                                identify areas of improvement, and make data-driven decisions that drive growth and success.
                                Our platform is designed to be user-friendly and accessible to all,
                                regardless of your technical expertise.
                            </Typography.Paragraph>
                            <Typography.Title level={4}>
                                Empowering Research Through AI Innovation.
                            </Typography.Title>
                        </div>
                        <Image preview={false} width={500} src="/research-paper.png" />
                    </Flex>
                </ProCard>
                <Row gutter={[32, 32]}>
                    {features.map((item) => {
                        return <Col key={item.key} md={12} xs={24}>
                            <ProCard ghost>
                                <Image preview={false} width={"100%"} src={item.logo} />
                            </ProCard>
                        </Col>
                    })}
                </Row>
            </Flex>
        </ProLayout >
    )
});

export default IndexRoute;
