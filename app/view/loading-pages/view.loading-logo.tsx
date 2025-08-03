import { Flex, Image, theme } from "antd";
import { observer } from "mobx-react";
import usePublicEnv from "~/use/use.publicEnv";
import { utilPublicEnv } from "~/util/util.public-env";

const ViewLoadingLogo = observer(() => {
    const { token } = theme.useToken();
    const env = usePublicEnv()

    return <Flex align="center" justify="center" style={{
        height: "100vh",
        background: token.colorBgBase
    }}>
        <Image
            className="loading-logo"
            height={60}
            style={{ userSelect: "none" }}
            preview={false}
            src={env.faviconPath}
        />
    </Flex>
});

export default ViewLoadingLogo;
