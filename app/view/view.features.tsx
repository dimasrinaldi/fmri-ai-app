import { ProCard } from "@ant-design/pro-components";
import { Col, Flex, Image, Row, Typography } from "antd";
import { observer } from "mobx-react";
import { getDataApp, TAppId } from "~/data/data.app";
import { useRootStore } from "~/root/store";
import usePublicEnv from "~/use/use.publicEnv";
import useVal from "~/use/use.val";
// import { utilPublicEnv } from "~/util/util.public-env";
type TypeProps = {
    hiName?: string;
    onClickFeature?: (props: {
        key: TAppId
    }) => void
    activeFeatures?: TAppId[]
}
export const ViewFeatures = observer((props: TypeProps) => {
    const env = usePublicEnv();
    const readyFeatures = [
        getDataApp("BrandDetection").id
    ]
    const activeFeatures = useVal(() => {
        let result = props.activeFeatures || [];
        result = result.filter((item) => {
            return readyFeatures.includes(item);
        })
        return result;
    });
    const isInApp = useVal(() => props.hiName != undefined);

    let features = useVal(() => {
        let result = [{
            key: getDataApp("BrandDetection").id,
            title: "Brand and Product Detection",
            description: "This feature advanced computer vision and AI algorithms to analyze footwear images, enabling automatic identification and classification of shoe types, brands, and styles.",
            image: "/running-shoes-sport-footwear-fitness.png",
            logo: "/findr.png"
        }, {
            key: getDataApp("BrandHealth").id,
            title: "Data Integration & Insight Dashboard",
            description: `This feature measures your brand's market performance by monitoring consumer perceptions and behavior, enabling strategic marketing decisions based on data insights.`,
            image: "/smartphone-application-production.png",
            logo: "/fuse.png"

        }, {
            key: getDataApp("SyntheticRespondent").id,
            title: "Concept and Ad Testing",
            description: "This feature uses AI to create virtual survey participants with realistic characteristics and behaviors based on real data. This helps researchers validate surveys and gain insights more efficiently.",
            image: "/a-brain-and-a-computer-chip-with-the-word-ai.png",
            logo: "/fine.png"
        }, {
            key: getDataApp("ECommerceAnalytics").id,
            title: "E-commerce Analytics",
            description: "E-commerce Analytics provides deep insights into online shopping behavior, sales patterns, and customer journeys. It helps businesses optimize their digital storefronts, improve conversion rates, and make data-driven decisions for better online retail performance.",
            image: "/laptop-with-ecommerce-tech.png",
            logo: ""
        }].map((item) => {
            return {
                ...item,
                hoverable: activeFeatures.includes(item.key),
                active: !isInApp ? true : activeFeatures.includes(item.key)
            }
        })
        return result;
    })

    return <Flex vertical justify="center" align="center" gap="large">
        <ProCard>
            <Flex gap="large" align="center">
                <div>
                    <Typography.Title level={1}>Welcome to {env.appName} !</Typography.Title>
                    {isInApp && <Typography.Title level={2}>Hi {props.hiName},</Typography.Title>}

                    <Typography.Paragraph>
                        {env.appName} is a smart ecosystem of research tools designed to help brands
                        evaluate, validate, and visualize how their ideas and products live in the real
                        world. Our platform combines cutting-edge AI technology with comprehensive data analysis
                        to deliver actionable insights for your business decisions.
                    </Typography.Paragraph>
                    {!isInApp && <>
                        <Typography.Paragraph>
                            With {env.appName}, you can gain a deeper understanding of your target audience,
                            identify areas of improvement, and make data-driven decisions that drive growth and success.
                            Our platform is designed to be user-friendly and accessible to all,
                            regardless of your technical expertise.
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            Empowering Research Through AI Innovation.
                        </Typography.Title>
                    </>}
                    {isInApp && <Typography.Title level={5}>
                        Select and click the features below to start analyzing.
                    </Typography.Title>}
                </div>
                <Image preview={false} width={isInApp ? 300 : 500} src="/research-paper.png" />
            </Flex>
        </ProCard>
        <Row gutter={[16, 16]}>
            {features.map((item, index) => {
                return <Col key={item.key} md={12} xs={24}>
                    <ProCard bordered style={{ opacity: item.active ? 1 : 0.3 }}
                        hoverable={item.hoverable}
                        title={<Flex gap={"small"} align="center">
                            {item.logo && <Image style={{ borderRadius: 3 }} height={30} src={item.logo} />}
                            <span>{item.title}</span>
                        </Flex>}
                        onClick={() => {
                            if (!item.active) return;
                            props.onClickFeature?.({
                                key: item.key as TAppId
                            })
                        }}
                    >
                        <Flex gap="large" align="center">
                            <Image preview={false} width={250} src={item.image} />
                            <Typography.Text>
                                {item.description}
                            </Typography.Text>
                        </Flex>
                    </ProCard>
                </Col>
            })}
        </Row>
    </Flex>
})