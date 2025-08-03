import { ProCard, ProCardProps } from "@ant-design/pro-components";
import { cx } from '@emotion/css';
import { observer } from "mobx-react";

type TypeProCardProps = ProCardProps & {
    noPadding?: boolean
}

const ViewProCard = observer((props: TypeProCardProps) => {
    const { noPadding, ...extProps } = props;
    return <ProCard
        className={cx(noPadding && "no-padding")}
        {...extProps}
    />
});

export default ViewProCard;
