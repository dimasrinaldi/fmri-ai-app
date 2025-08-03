import { useResizeDetector } from "react-resize-detector";
import { useIsSpan } from "./use.is-span";

type TypeInput = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
}
export default function useResponsiveWidth(input: TypeInput) {
    const span = useIsSpan();
    const { width: containerWidth, ref } = useResizeDetector({
        refreshMode: "throttle",
    });
    let width: number | "auto" = "auto";
    if (
        containerWidth === undefined
        || [input.xs, input.sm, input.md, input.lg, input.xl]
            .filter(x => x && x > 0).length === 0
    ) return { width, ref }

    let limit = 1;
    if (span.xs) {
        limit = input.xs || limit
    } else if (span.sm) {
        limit = input.sm || input.xs || limit
    } else if (span.md) {
        limit = input.md || input.sm || input.xs || limit
    } else if (span.lg) {
        limit = input.lg || input.md || input.sm || input.xs || limit
    } else if (span.xl) {
        limit = input.xl || input.lg || input.md || input.sm || input.xs || limit
    } else if (span.xxl) {
        limit = input.xxl || input.xl || input.lg || input.md || input.sm || input.xs || limit
    }

    if (limit > 0) {
        width = containerWidth / limit;
    }
    return { ref, width }
}
