import Logger from "../../../config/logger";
import pool from "../../../config/database";
import { secret_config } from "../../../config/secret";
import * as userDao from "./userDao";
import * as userProvider from "./userProvider"
import baseResponse from "../../../config/baseResponseStatus";
import {response} from "../../../config/response";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const createUser = async function (email:string, password:string) {
    try {
        const connection = await (await pool).getConnection();
        await connection.beginTransaction();
        try {
            // 이메일 중복 확인
            const emailRows = await userProvider.emailCheck(email);
            if (emailRows.length > 0) return response(baseResponse.SIGNUP_REDUNDANT_EMAIL);
    
            // 비밀번호 암호화
            const hashedPassword = await crypto
                .createHash("sha512")
                .update(password)
                .digest("hex");
    
            const insertUserInfoParams = [email, hashedPassword];
            
            // 유저 생성
            await userDao.insertUser(connection, insertUserInfoParams);
    
            // DB 트랜잭션 Commit
            await connection.commit();
            await connection.release();
            Logger.info(`App - email : ${email} posted user`);
            return response(baseResponse.SUCCESS);
    
        } catch (err: any) {
            connection.rollback();
            Logger.error(`App - createUser Service Query error\n: ${err.message} \n ${err}`);
            return response(baseResponse.QUERY_ERROR);
        }
    } catch(err: any) {
        Logger.error(`App - createUser Service DB error\n: ${err.message} \n ${err}`);
        return response(baseResponse.DB_ERROR);
    }
};

const postSignIn = async function (email:string, password:string) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return response(baseResponse.SIGNIN_EMAIL_WRONG);
        
        const selectEmail = emailRows[0].email;

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        
        if(passwordRows.length<1) return response(baseResponse.SIGNIN_PASSWORD_WRONG);
        if (passwordRows[0].password !== hashedPassword) return response(baseResponse.SIGNIN_PASSWORD_WRONG);
        

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === "INACTIVE") return response(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        else if (userInfoRows[0].status === "DELETED") return response(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        
        let token = await jwt.sign({
                userId: userInfoRows[0].userId,
            }, 
            secret_config.secret, 
            {
                expiresIn: "365d",
                subject: "userInfo",
            } 
        );
        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token});

    } catch (err: any) {
        Logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return response(baseResponse.DB_ERROR);
    }
};

const updateUserVacation = async function (userId:number, vacationDays:number) {
    try {
        const connection = await (await pool).getConnection();
        await connection.beginTransaction();
        try {
            const user = await userDao.updateUserVacation(connection, vacationDays, userId);
    
            await connection.commit();
            await connection.release();
          
            return response(baseResponse.SUCCESS);
    
        } catch (err: any) {
            connection.rollback();
            Logger.error(`App - updateUserVacation Service Query error\n: ${err.message} \n ${err}`);
            return response(baseResponse.QUERY_ERROR);
        }
    } catch(err: any) {
        Logger.error(`App - updateUserVacation Service DB error\n: ${err.message} \n ${err}`);
        return response(baseResponse.DB_ERROR);
    }
};

const updateAllUserVacation = async function (vacationDays:number) {
    try {
        const connection = await (await pool).getConnection();
        await connection.beginTransaction();
        try {
            await userDao.updateAllUserVacation(connection, vacationDays);
    
            await connection.commit();
            await connection.release();
          
            return response(baseResponse.SUCCESS);
    
        } catch (err: any) {
            connection.rollback();
            Logger.error(`App - updateUserVacation Service Query error\n: ${err.message} \n ${err}`);
            return response(baseResponse.QUERY_ERROR);
        }
    } catch(err: any) {
        Logger.error(`App - updateUserVacation Service DB error\n: ${err.message} \n ${err}`);
        return response(baseResponse.DB_ERROR);
    }
};

export{createUser, postSignIn, updateUserVacation, updateAllUserVacation}