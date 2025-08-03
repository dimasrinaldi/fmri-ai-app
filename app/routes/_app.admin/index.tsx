import { Outlet } from "@remix-run/react";
import { Building2Icon, User2Icon, UserRoundCogIcon } from "lucide-react";
import { TypeRoute } from "../_app/type.route";
import ViewLayoutMain from "../_app/view.layout-main";
import { hocAdmin } from "./store";

const AdminIndex = hocAdmin(({ store }) => {

    const routes: TypeRoute[] = [
        {
            path: '/admin/client-list',
            name: 'Client',
            icon: <Building2Icon />,
        }, {
            path: '/admin/user-list',
            name: 'User',
            icon: <User2Icon />,
        },
        {
            path: '/admin/role-list',
            name: 'Role',
            icon: <UserRoundCogIcon />,
        }
    ]

    return <ViewLayoutMain
        title="Admin"
        logo="/tool-clipart-design.png"
        route={{ routes }}
    >
        <Outlet />
    </ViewLayoutMain>;
});

export default AdminIndex;
