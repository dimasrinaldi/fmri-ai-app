import { FileQuestionMarkIcon } from "lucide-react";
import { observer } from "mobx-react";
import { TypeRoute } from "../_app/type.route";
import ViewPageMain from "../_app/view.layout-main";

interface Props {
    routes?: TypeRoute[];
    children: React.ReactNode;
}

const ViewLayoutMain = observer((props: Props) => {
    const routes: TypeRoute[] = [
        {
            path: `/survey/list`,
            name: 'List',
            icon: <FileQuestionMarkIcon />,
        },
        ...(props.routes || [])
    ]

    return <ViewPageMain
        title="Survey"
        logo="/survey-icon-hand.png"
        route={{ routes }}
    >
        {props.children}
    </ViewPageMain>;
});

export default ViewLayoutMain;
