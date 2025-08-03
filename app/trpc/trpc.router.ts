/**
 * This file contains the root router of your tRPC-backend
 */
import { trpcProcedure, trpcRouter } from "./trpc.app";

// root
import { apiRoot as root } from "~/root/api.root";

// app
import { apiAsk as appChatModalAsk } from "~/routes/_app/view.chat-modal/api.ask";
import { apiClients as appClients } from "~/routes/_app/api.clients"
// survey
// import { apiList as surveyList } from "~/routes/_app.survey-list._index/api.list";
// import { apiOne as surveyIdOne } from "~/routes/_app.survey.$id/api.one";
// import { apiAsk as surveyIdChatAsk } from "~/routes/_app.survey.$id.chat._index/api.ask";
// import { apiFilterFields as surveyIdFilterFields } from "~/routes/_app.survey.$id._filter/api.filter-fields"
// import { apiList as surveyIdDataList } from "~/routes/_app.survey.$id.data._index/api.list"
// import { apiList as surveyIdRespondentList } from "~/routes/_app.survey.$id.respondent._index/api.list";
// import { apiStat as surveyIdPivotTableStat } from "~/routes/_app.survey.$id._filter.pivot-table._index/api.stat"
// import { apiOne as surveyIdInfoOne } from "~/routes/_app.survey.$id.info._index/api.one"
// import { apiList as surveyIdAnswerList } from "~/routes/_app.survey.$id.answer._index/api.list"
// import { answering as surveyIdAnswerAnswering } from "~/routes/_app.survey.$id.answer._index/api.answering"
// import { clearAnswer as surveyIdAnswerClearAnswer } from "~/routes/_app.survey.$id.answer._index/api.clear-answers"
// import { apiStat as surveyIdStatsViewBasicStats } from "~/routes/_app.survey.$id._filter.stats._index/view.basic-chart/api.stat"

// // survey brand awareness
// import { apiStat as surveyIdBrandAwarenessViewTomStat } from "~/routes/_app.survey.$id._filter.brand-awareness._index/view.tom/api.stat"
// import { apiStat as surveyIdBrandAwarenessViewSpontStat } from "~/routes/_app.survey.$id._filter.brand-awareness._index/view.spont/api.stat"
// import { apiStat as surveyIdBrandAwarenessViewBumoStat } from "~/routes/_app.survey.$id._filter.brand-awareness._index/view.bumo/api.stat"
// import { apiStat as surveyIdBrandAwarenessViewAwarenessStat } from "~/routes/_app.survey.$id._filter.brand-awareness._index/view.awareness/api.stat"

// shoe detection
// import { apiList as shoeDetectionDataList } from "~/routes/_app.shoe-detection._filter.data/api.list"
// import { apiOne as shoeDetectionDataIdEditOne } from "~/routes/_app.shoe-detection._filter.data.$id.edit/api.one"
// import { apiEdit as shoeDetectionDataIdEdit } from "~/routes/_app.shoe-detection._filter.data.$id.edit/api.edit"
// import { apiDelete as shoeDetectionDataIdDelete } from "~/routes/_app.shoe-detection._filter.data.$id.edit/api.delete"


// import { apiFilterFields as shoeDetectionFilterFields } from "~/routes/_app.shoe-detection._filter/api.filter-fields"
// import { apiStat as shoeDetectionStatsViewBasicStats } from "~/routes/_app.shoe-detection._filter.stats/view.basic-chart/api.stat"
// import { apiTotal as shoeDetectionStatsViewTotalBox } from "~/routes/_app.shoe-detection._filter.stats/view.total-box/api.total"
// import { apiStat as shoeDetectionPivotTableStats } from "~/routes/_app.shoe-detection._filter.pivot-table/api.stat"



// import { apiRecognizing as shoeDetectionRecognizing } from "~/routes/_app.shoe-detection.recognizing/api.recognizing"
// import { apiList as shoeDetectionRecognizingList } from "~/routes/_app.shoe-detection.recognizing/api.list"
// import { apiEdit as shoeDetectionRecognizingEdit } from "~/routes/_app.shoe-detection.recognizing/view.edit/api.edit"

// // import { apiList as shoeDetectionEventList } from "~/routes/_app.shoe-detection-event-list._index/api.list";
// // import { apiOne as shoeDetectionOne } from "~/routes/_app.shoe-detection/api.one";

// auth
import { apiProfile as authProfile } from "~/root/auth/api.profile";
import { apiLogout as authLogout } from "~/root/auth/api.logout";

// // roles 
// import { apiList as adminRoleList } from "~/routes/_app.admin.role-list/api.list"
// // clients
// import { apiList as adminClientList } from "~/routes/_app.admin.client-list/api.list"
// import { apiOne as adminClientListIdEditOne } from "~/routes/_app.admin.client-list.$id.edit/api.one"
// import { apiEdit as adminClientListIdEdit } from "~/routes/_app.admin.client-list.$id.edit/api.edit"
// import { apiCreate as adminClientListIdEditCreate } from "~/routes/_app.admin.client-list.$id.edit/api.create"

// // users
// import { apiList as adminUserList } from "~/routes/_app.admin.user-list/api.list"
// import { apiOne as adminUserListIdEditOne } from "~/routes/_app.admin.user-list.$id.edit/api.one"
// import { apiClients as adminUserListIdEditClients } from "~/routes/_app.admin.user-list.$id.edit/api.clients"
// import { apiRoles as adminUserListIdEditRoles } from "~/routes/_app.admin.user-list.$id.edit/api.roles"
// import { apiEdit as adminUserListIdEdit } from "~/routes/_app.admin.user-list.$id.edit/api.edit"
// import { apiCreate as adminUserListIdCreate } from "~/routes/_app.admin.user-list.$id.edit/api.create"
// import { apiOne as adminUserListIdResetPasswordOne } from "~/routes/_app.admin.user-list.$id.reset-password/api.one"
// import { apiResetPassword as adminUserListIdResetPassword } from "~/routes/_app.admin.user-list.$id.reset-password/api.reset-password"

// // change password
// import { apiChangePassword as adminChangePassword } from "~/routes/_app.profile.change-password/api.change-password"
// public
import { apiLogin as login } from "~/routes/login/api.login";

export const appRouter = trpcRouter({
  healthcheck: trpcProcedure.query(() => "yay!"),

  root,
  login,
  appChatModalAsk,
  appClients,

  // // survey
  // // surveyList,
  // // surveyIdOne,
  // // surveyIdChatAsk,
  // // surveyIdFilterFields,
  // // surveyIdPivotTableStat,
  // // surveyIdInfoOne,
  // // surveyIdAnswerList,
  // // surveyIdAnswerAnswering,
  // // surveyIdAnswerClearAnswer,
  // // surveyIdStatsViewBasicStats,

  // // // survey brand awareness
  // // surveyIdBrandAwarenessViewTomStat,
  // // surveyIdBrandAwarenessViewSpontStat,
  // // surveyIdBrandAwarenessViewBumoStat,
  // // surveyIdBrandAwarenessViewAwarenessStat,

  // // shoe detection
  // shoeDetectionDataList,
  // shoeDetectionDataIdEditOne,
  // shoeDetectionDataIdEdit,
  // shoeDetectionFilterFields,
  // shoeDetectionStatsViewBasicStats,
  // shoeDetectionStatsViewTotalBox,
  // shoeDetectionPivotTableStats,
  // shoeDetectionRecognizing,
  // shoeDetectionRecognizingList,
  // shoeDetectionRecognizingEdit,
  // shoeDetectionDataIdDelete,

  // // synthetic respondent
  // surveyIdRespondentList,

  // auth
  authProfile,
  authLogout,
  // // role 
  // adminRoleList,
  // // client
  // adminClientList,
  // adminClientListIdEditOne,
  // adminClientListIdEdit,
  // adminClientListIdEditCreate,
  // // user
  // adminUserList,
  // adminUserListIdEditOne,
  // adminUserListIdEditClients,
  // adminUserListIdEdit,
  // adminUserListIdEditRoles,
  // adminUserListIdCreate,
  // adminUserListIdResetPasswordOne,
  // adminUserListIdResetPassword,
  // // change password
  // adminChangePassword,
  // // survey data
  // surveyIdDataList,
});

export type AppRouter = typeof appRouter;
