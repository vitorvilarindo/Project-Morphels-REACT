import {localReportsData,
setReportPreset,
listReports} from "../controllers/reportsController.js"
export default async function repostsRotes(server){
    server.get("/reports", {preHandler: server.checkPermissions("can_view"),handler: listReports});
    server.post("/reports/local", localReportsData)
    server.post("/reports/setReportPreset", {preHandler: server.checkPermissions("can_add"),handler: setReportPreset})
}