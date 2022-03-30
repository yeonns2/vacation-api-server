import {Application} from "express";
import * as vacation from './vacationController';
import jwtMiddleware from "../../../config/jwtMiddleware";
const VacationRoute = function(app:Application){
    
    // 휴가 신청 API
    app.post("/vacations", jwtMiddleware, vacation.postVacation);

    // 휴가 목록 조회 API
    app.get("/vacations", jwtMiddleware, vacation.getVacation);

    // 휴가 상세 조회 API
    app.get("/vacations/:vacationId", jwtMiddleware, vacation.getVacationById);

    // 휴가 취소 API
    app.delete("/vacations/:vacationId/cancel", jwtMiddleware, vacation.deleteVacation);

};

export default VacationRoute;
