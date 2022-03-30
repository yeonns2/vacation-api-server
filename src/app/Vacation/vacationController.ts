import { Request, Response } from "express";
import { postVacationDto } from "./vacationTypes";
import * as vacationProvider from "./vacationProvider";
import * as vacationService from "./vacationService";
import * as userService from "../User/userService";
import * as userProvider from "../User/userProvider";
import ResponseMessage from "../../../config/baseResponseStatus";
import {response} from "../../../config/response";
import {validate, ValidationError } from "class-validator";
import Logger from "../../../config/logger";

/*
 * API Name : 휴가 신청 API
 * [POST] /vacations
 * Body: type, startDate, endDate, comment
 */
const postVacation = async function (req: Request, res: Response) {
    const userId = req.verifiedToken.userId;
    const request = req.body;
    const body = new postVacationDto(request);
    const errors: ValidationError[] = await validate(body);
   
    if (errors.length > 0) {
        Logger.error(`App - postVacation Service error\n: ${errors[0]} \n ${JSON.stringify(errors[0].constraints)}`);
        return res.send(response(ResponseMessage.VALIDATION_ERROR));
    } else {
        console.log('validation succeed');
    }

    // 휴가 등록
    const vacationResponse = await vacationService.createVacation(userId, body.type, body.startDate, body.endDate, body.comment);

    return res.send(vacationResponse);
};

/**
 * API Name : 휴가 목록 조회 API 
 * [GET] /vacations
 */
const getVacation = async function (req: Request, res: Response) {
   const userId = req.verifiedToken.userId;
   if(!userId) return res.send(response(ResponseMessage.USER_USERID_EMPTY));

   const vacationListByUser = await vacationProvider.retrieveVacationList(userId);
   return res.send(response(ResponseMessage.SUCCESS, vacationListByUser));    
};

/**
 * API Name : 특정 휴가 조회 API
 * [GET] /vacations/:vacationId
 * Path Variable: vacationId
 */
const getVacationById = async function (req: Request, res: Response) {
    const vacationId = parseInt(req.params.vacationId);
    const userId = req.verifiedToken.userId;
    
    if(!userId) return res.send(response(ResponseMessage.USER_USERID_EMPTY));
    if (!vacationId) return res.send(response(ResponseMessage.VACATION_ID_EMPTY));

    const vacationResult = await vacationProvider.retrieveVacationById(vacationId);
    
    if(vacationResult.length < 1) return res.send(response(ResponseMessage.VACATION_ID_NOT_EXIST));
    if(vacationResult[0].userId != userId) return res.send(response(ResponseMessage.VACATION_NOT_PERMISSION));
    

    return res.send(response(ResponseMessage.SUCCESS, vacationResult[0]));
};

/**
 * API Name : 휴가 취소 API
 * [DELETE] /vacations/:vacationId/cancel
 * Path Variable: vacationId
 */
 const deleteVacation = async function (req:Request, res:Response) {
    const vacationId = parseInt(req.params.vacationId);
    const userId = req.verifiedToken.userId;

    if(!userId) return res.send(response(ResponseMessage.USER_USERID_EMPTY));
    if(!vacationId) return res.send(response(ResponseMessage.VACATION_ID_EMPTY));

    const vacationResult = await vacationProvider.retrieveVacationById(vacationId);
    
    if(vacationResult.length < 1) return res.send(response(ResponseMessage.VACATION_ID_NOT_EXIST));
    if(vacationResult[0].userId != userId) return res.send(response(ResponseMessage.VACATION_NOT_PERMISSION));
    if(vacationResult[0].startDate < Date.now()) return res.send(response(ResponseMessage.VACATION_PERIOD_PASSED));


    let period = vacationResult[0].period;
    const userVacationResult = await userProvider.retrieveUserVacation(userId);
    const userDays = userVacationResult.vacationDays;
    let updateDays = userDays + period;
    
    await vacationService.deleteVacation(vacationId); 
    await userService.updateUserVacation(userId, period);

    return res.send(response(ResponseMessage.SUCCESS,{ remainingVacation : updateDays }));
}

export {postVacation, getVacation, getVacationById, deleteVacation}