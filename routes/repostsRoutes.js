import {localReportsData} from "../controllers/reportsController.js"
export default async function repostsRotes(server){
    server.post("/reports/local", localReportsData)
}