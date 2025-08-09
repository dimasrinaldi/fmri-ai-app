import { Outlet } from "@remix-run/react";
import { hocSurvey } from "./store";
import ViewPageMain from "./view.layout-main";

const AdminIndex = hocSurvey(({ store }) => {

    return store.isExistSurveyId ? <Outlet />
        : <ViewPageMain>
            <Outlet />
        </ViewPageMain>

});

export default AdminIndex;
