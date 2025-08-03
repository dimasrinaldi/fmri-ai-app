import { Outlet } from '@remix-run/react';
import { hocShoeDetectionFilter } from "./store";

const ShoeDetectionFilter = hocShoeDetectionFilter(() => {
    return <Outlet />
});
export default ShoeDetectionFilter;