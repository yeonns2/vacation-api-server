import Logger from "../../../config/logger";
import pool from "../../../config/database";
import * as vacationDao from "./vacationDao";
import * as vacationProvider from "./vacationProvider";
import * as userProvider from "../User/userProvider"
import * as userDao from "../User/userDao";
import * as vacationLibrary from "../../library/vacationLibrary";

import baseResponse from "../../../config/baseResponseStatus";
import {response} from "../../../config/response";
import moment from "moment";

moment.tz.setDefault("Asia/Seoul");
vacationLibrary.vacationReset();

const createVacation = async function (userId: number, type:number, startDate:Date, endDate:Date, comment:string) {
    // 신청한 휴가가 현재 이후일 경우
    if(moment(startDate) < moment(Date.now())) return response(baseResponse.VACATION_REQUEST_PERIOD_PASSED);

    // 기간 안에 등록된 휴가가 존재하는 경우
    const vacationData = await vacationProvider.retrieveVacationByDate(userId, startDate, endDate);
    if(vacationData.length > 0 ) return response(baseResponse.VACATION_PERIOD_EXIST);  
    
    // 휴가일 수 계산
    let vacationDay = await vacationLibrary.checkVacationDate(type, startDate, endDate);
    if(vacationDay < 0) return response(baseResponse.VACATION_START_OVER_END);   

    // 신청한 휴가가 남은 휴가보다 길 경우 
    const userData = await userProvider.retrieveUserVacation(userId);
    const remainVacation = userData.vacationDays;
    if(remainVacation - vacationDay < 0 ) return response(baseResponse.VACATION_DAYS_OVER); 

    try {
        const connection = await (await pool).getConnection();
        await connection.beginTransaction();
        try {
            const insertVacationParams = [userId, type, startDate, endDate, vacationDay, comment];
    
            // 휴가 생성
            await vacationDao.insertVacation(connection, insertVacationParams);
            await userDao.updateUserVacation(connection, (-1)*vacationDay, userId);

            await connection.commit();
            await connection.release();
            
            return response(baseResponse.SUCCESS, {remainingVacation :remainVacation - vacationDay });
        } catch (err: any) {
            connection.rollback();
            Logger.error(`App - createVacation Service Query error\n: ${err.message} \n ${err}`);
            return response(baseResponse.QUERY_ERROR);
        }
    } catch(err: any) {
        Logger.error(`App - createVacation Service DB error\n: ${err.message} \n ${err}`);
        return response(baseResponse.DB_ERROR);
    }
};

const deleteVacation = async function (vacationId : number) {
    try {
        const connection = await (await pool).getConnection();
        await connection.beginTransaction();
        try {
            
            await vacationDao.deleteVacation(connection, vacationId);
            
            await connection.commit();
            await connection.release();
            
            return response(baseResponse.SUCCESS);
        } catch (err: any) {
            connection.rollback();
            Logger.error(`App - deleteVacation Service Query error\n: ${err.message} \n ${err}`);
            return response(baseResponse.QUERY_ERROR);
        }
    } catch(err: any) {
        Logger.error(`App - deleteVacation Service DB error\n: ${err.message} \n ${err}`);
        return response(baseResponse.DB_ERROR);
    }
};

export {createVacation, deleteVacation}