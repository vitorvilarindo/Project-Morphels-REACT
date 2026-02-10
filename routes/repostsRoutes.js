import {localReportsData,
setReportPreset,
listReports} from "../controllers/reportsController.js"
export default async function repostsRotes(server){
    server.get("/reports", listReports);
    server.post("/reports/local", localReportsData)
    server.post("/reports/setReportPreset", setReportPreset)
}