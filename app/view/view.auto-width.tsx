import { Col, Row } from "antd"
import { CSSProperties, ReactNode } from "react"

type TProps = {
    children: ReactNode;
    id?: string
    span?: number;
    outerStyle?: CSSProperties
    innerStyle?: CSSProperties
}
export const ViewAutoWidth = (props: TProps) => {
    const maxSpan = 24;
    const xlSpan = props.span ?? 24;
    const midSpan = (xlSpan + maxSpan) / 2
    return <Row id={`${props.id}-outer`} style={props.outerStyle}>
        <Col
            id={`${props.id}-inner`}
            xs={{ span: maxSpan, offset: 0 }}
            sm={{ span: maxSpan, offset: 0 }}
            md={{ span: midSpan, offset: Math.floor((maxSpan - midSpan) / 2) }}
            xl={{ span: xlSpan, offset: Math.floor((maxSpan - xlSpan) / 2) }}
            xxl={{ span: xlSpan, offset: Math.floor((maxSpan - xlSpan) / 2) }}
            style={props.innerStyle}
        >
            {props.children}
        </Col>
    </Row>
}