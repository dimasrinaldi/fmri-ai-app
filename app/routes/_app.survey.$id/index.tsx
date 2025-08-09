import { Outlet } from '@remix-run/react';
import { Button, Result } from 'antd';
import ViewLoadingLogo from '~/view/loading-pages/view.loading-logo';
import { hocSurveyId } from "./store";
import ViewLayout from '../_app.survey/view.layout-main';
import { TypeRoute } from '../_app/type.route';
import { BarChart, BookUser, FileQuestion, FolderKanban, Grid3x3, Info, MessageCircle, ScrollText, Target } from 'lucide-react';

const SurveyIdRoute = hocSurveyId(({ store }) => {
    if (store.isLoadingOne) return <ViewLoadingLogo />;
    if (!store.isShowContent) return <Result
        status="403"
        title="Please provide valid survey ID"
        subTitle={<Button type="primary" onClick={() => store.qurl.set("/survey")}>Go to Surveys</Button>}
    />;

    const routes: TypeRoute[] = [
        {
            path: `/survey/${store.surveyId}/info`,
            name: 'Information',
            icon: <Info />,
        },
        // {
        //     path: `/survey/${store.surveyId}/stats`,
        //     name: 'Statistics',
        //     icon: <BarChart />,
        // }, {
        //     path: `/survey/${store.surveyId}/brand-awareness`,
        //     name: 'Brand Awareness',
        //     icon: <Target />,
        // },
        // {
        //     path: `/survey/${store.surveyId}/pivot-table`,
        //     name: 'Pivot Table',
        //     icon: <Grid3x3 />,
        // },
        // {
        //     path: `/survey/${store.surveyId}/chat`,
        //     name: 'Chat',
        //     icon: <MessageCircle />,
        // },
        // {
        //     path: `/survey/${store.surveyId}/data`,
        //     name: 'Data',
        //     icon: <FileQuestion />,
        // }, ...(store.respondentType != "Synthetic" ? [] : [{
        //     path: `/survey/${store.surveyId}/respondent`,
        //     name: 'Respondent',
        //     icon: <BookUser />,
        // }, {
        //     path: `/survey/${store.surveyId}/answer`,
        //     name: 'Answer',
        //     icon: <ScrollText />,
        // }])
    ]

    return <ViewLayout routes={routes}>
        <Outlet />
    </ViewLayout>
});
export default SurveyIdRoute;