import { Outlet } from '@remix-run/react';
import { hocSurveyIdFilter } from "./store";

const SurveyIdFilterRoute = hocSurveyIdFilter(() => {
    return <Outlet />
});
export default SurveyIdFilterRoute;