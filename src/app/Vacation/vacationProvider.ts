import pool from "../../../config/database";
import Logger from "../../../config/logger";
import {response} from "../../../config/response";
import * as vacationDao from "./vacationDao";
import baseResponse from "../../../config/baseResponseStatus";


const retrieveVacationList = async function (userId : number){
  try {
    const connection = await (await pool).getConnection();
    try {
        const vacationListResult = await vacationDao.selectVacation(connection, userId);

        await connection.release();
    
        return vacationListResult;
      
    } catch (err: any) {
      Logger.error(`App - retrieveVacationList provider Query error\n: ${err.message} \n ${err}`);
      return response(baseResponse.QUERY_ERROR);
    }
  } catch (err: any) {
    Logger.error(`App - retrieveVacationList provider DB error\n: ${err.message} \n ${err}`);
    return response(baseResponse.DB_ERROR);
  }
}

const retrieveVacationById = async function (vacationId : number){
  try {
    const connection = await (await pool).getConnection();
    try {
       
        const vacationListResult = await vacationDao.selectVacationById(connection, vacationId);

        await connection.release();
    
        return vacationListResult;
      
    } catch (err: any) {
      Logger.error(`App - retrieveVacationById provider Query error\n: ${err.message} \n ${err}`);
      return response(baseResponse.QUERY_ERROR);
    }
  } catch (err: any) {
    Logger.error(`App - rretrieveVacationById provider DB error\n: ${err.message} \n ${err}`);
    return response(baseResponse.DB_ERROR);
  }
}

const retrieveVacationByDate = async function (userId : number, startDate : Date, endDate : Date){
  try {
    const connection = await (await pool).getConnection();
    try {
       
        const vacationListResult = await vacationDao.selectVacationByDate(connection, userId, startDate, endDate);

        await connection.release();
    
        return vacationListResult;
      
    } catch (err: any) {
      Logger.error(`App - retrieveVacationByDate provider Query error\n: ${err.message} \n ${err}`);
      return response(baseResponse.QUERY_ERROR);
    }
  } catch (err: any) {
    Logger.error(`App - retrieveVacationByDate provider DB error\n: ${err.message} \n ${err}`);
    return response(baseResponse.DB_ERROR);
  }
}

const retrieveHoliday = async function (startDate : Date, endDate : Date){
  try {
    const connection = await (await pool).getConnection();
    try {
        const holidayListResult = await vacationDao.selectHoliday(connection, startDate, endDate);
        await connection.release();
        return holidayListResult;
      
    } catch (err: any) {
      Logger.error(`App - retrieveHoliday provider Query error\n: ${err.message} \n ${err}`);
      return response(baseResponse.QUERY_ERROR);
    }
  } catch (err: any) {
    Logger.error(`App - retrieveHoliday provider DB error\n: ${err.message} \n ${err}`);
    return response(baseResponse.DB_ERROR);
  }
}



export {retrieveVacationList, retrieveVacationById, retrieveVacationByDate, retrieveHoliday}