import { Spin } from "antd";
import { observer } from "mobx-react";

const ViewLoadingMask = observer(() => (
    <Spin fullscreen delay={0} size="large" />
));

export default ViewLoadingMask;
