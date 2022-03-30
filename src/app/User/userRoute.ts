import {Application} from "express";
import * as user from './userController';
import jwtMiddleware from "../../../config/jwtMiddleware";
const UserRoute = function(app:Application){
    
    // 테스트 API
    app.get('/test', user.getTest);

    // 유저 생성 (회원가입) API
    app.post('/users/sign-up',user.postSignUp);

    // 로그인 하기 API (JWT 생성)
    app.post('/users/sign-in', user.postSignIn);

};

export default UserRoute;
