import pool from "../../../config/database";
import Logger from "../../../config/logger";
import {response} from "../../../config/response";
import * as userDao from "./userDao";
import baseResponse from "../../../config/baseResponseStatus";

const emailCheck = async function (email: any) {
    try {
      const connection = await (await pool).getConnection();  
      try {
        const emailCheckResult = await userDao.selectUserEmail(connection, email);
        await connection.release();
  
        return emailCheckResult;  
      } catch (err: any) {
        Logger.error(`App - email check provider Query error\n: ${err.message} \n ${err}`);
        return response(baseResponse.QUERY_ERROR);
      }
    } catch (err: any) {
      Logger.error(`App - email check provider DB error\n: ${err.message} \n ${err}`);
        return response(baseResponse.DB_ERROR);
    }
};

const passwordCheck = async function (selectUserPasswordParams: any) {
    try {
      const connection = await (await pool).getConnection();
      try {
        const passwordCheckResult = await userDao.selectUserPassword(
            connection,
            selectUserPasswordParams
        );
        await connection.release();
        return passwordCheckResult;
      } catch (err: any) {
        Logger.error(`App - password check provider Query error\n: ${err.message} \n ${err}`);
        return response(baseResponse.QUERY_ERROR);
      }
    } catch (err: any) {
      Logger.error(`App - password check provider DB error\n: ${err.message} \n ${err}`);
      return response(baseResponse.DB_ERROR);
    }
};
  
const accountCheck = async function (email: any) {
    try {
      const connection = await (await pool).getConnection();
      try {      
        const userAccountResult = await userDao.selectUserAccount(connection, email);
        await connection.release();
  
        return userAccountResult;
      } catch (err: any) {
        Logger.error(`App - account check provider Query error\n: ${err.message} \n ${err}`);
        return response(baseResponse.QUERY_ERROR);
      }
    } catch (err: any) {
      Logger.error(`App - account check provider DB error\n: ${err.message} \n ${err}`);
      return response(baseResponse.DB_ERROR);
    }
};

const retrieveUserVacation = async function (userId: number) {
    try {
      const connection = await (await pool).getConnection();
      try {      
        const userVacationResult = await userDao.selectUserVacation(connection, userId);
        await connection.release();
  
        return userVacationResult;
      } catch (err: any) {
        Logger.error(`App - retrieve user vacation provider Query error\n: ${err.message} \n ${err}`);
        return response(baseResponse.QUERY_ERROR);
      }
    } catch (err: any) {
      Logger.error(`App - retrieve user vacation provider DB error\n: ${err.message} \n ${err}`);
      return response(baseResponse.DB_ERROR);
    }
  };

export{emailCheck, passwordCheck, accountCheck, retrieveUserVacation}