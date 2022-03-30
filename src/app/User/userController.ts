import { Request, Response } from "express";
import { postUserDto } from "./userTypes";
import * as userService from "./userService";
import ResponseMessage from "../../../config/baseResponseStatus";
import {response} from "../../../config/response";
import Logger from "../../../config/logger";
import { validate, ValidationError } from "class-validator";


/**
 * API Name : 테스트 API
 * [GET] /app/test
 */
const getTest = async function (req: Request, res: Response) {
    return res.send(response(ResponseMessage.SUCCESS))
}


/**
 * API Name : 유저 생성 (회원가입) API
 * [POST] /users/sign-up
 * body: email, password
 */
 const postSignUp = async function (req: Request, res: Response) {
    const request = req.body;
    const body = new postUserDto(request);
    const errors: ValidationError[] = await validate(body);

    if (errors.length > 0) {
        Logger.error(`App - postSignIn Service error\n: ${errors[0]} \n ${JSON.stringify(errors[0].constraints)}`);
        return res.send(response(ResponseMessage.VALIDATION_ERROR));
    } else {
        console.log('validation succeed');
        const signUpResponse = await userService.createUser(body.email, body.password);
        return res.send(signUpResponse);
    }

};

/**
 * API Name : 로그인 API
 * [POST] /users/sign-in
 * body : email, passsword
 */
 const postSignIn = async function (req: Request, res: Response) {
    const request = req.body;
    const body = new postUserDto(request);
    const errors: ValidationError[] = await validate(body);

    if (errors.length > 0) {
        Logger.error(`App - postSignIn Service error\n: ${errors[0]} \n ${JSON.stringify(errors[0].constraints)}`);
        return res.send(response(ResponseMessage.VALIDATION_ERROR));
    } 

    const signInResponse = await userService.postSignIn(body.email, body.password);

    return res.send(signInResponse);
};

export{getTest, postSignUp, postSignIn}