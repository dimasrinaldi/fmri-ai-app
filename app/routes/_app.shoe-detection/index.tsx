import { Outlet } from "@remix-run/react";
import { Database, DiamondPercent, PieChart, SearchCheckIcon } from "lucide-react";
import { TypeRoute } from "../_app/type.route";
import ViewPageMain from "../_app/view.layout-main";
import { hocShoeDetection } from "./store";

const AdminIndex = hocShoeDetection(({ store }) => {

    const routes: TypeRoute[] = [
        {
            path: `/shoe-detection/stats`,
            name: 'Statistics',
            icon: <PieChart />,
        }, {
            path: `/shoe-detection/pivot-table`,
            name: 'Pivot Table',
            icon: <DiamondPercent />,
        }, {
            path: `/shoe-detection/data`,
            name: 'Data',
            icon: <Database />,
        }, {
            path: `/shoe-detection/recognizing`,
            name: store.access.featurePrivileged ? 'Recognizing' : "",
            icon: <SearchCheckIcon />,
        }
    ].filter(i => i.name)

    return <ViewPageMain
        title="Shoe Detection"
        logo="/running-shoes-sport-footwear-fitness.png"
        route={{ routes }}
    >
        <Outlet />
    </ViewPageMain>;
});

export default AdminIndex;
