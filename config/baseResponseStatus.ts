/* eslint-disable prettier/prettier */
export interface ResponseMessageModel {
    isSuccess: boolean,
    code: number,
    message: string
};

const setMessage = (isSuccess : boolean, code : number, message : string) => {
    return {isSuccess: isSuccess, code: code, message: message}
}

const ResponseMessage = {
    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 8~20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },
    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    VACATION_ID_EMPTY :{ "isSuccess": false, "code": 2019, "message": "신청한 휴가 ID값을 입력해주세요." },
    VACATION_ID_NOT_EXIST :{ "isSuccess": false, "code": 2020, "message": "해당 휴가가 존재하지 않습니다." },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 틀렸습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 틀렸습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },


    VACATION_REQUEST_PERIOD_PASSED :  { "isSuccess": false, "code": 3007, "message": "휴가는 현재 이후부터 신청할 수 있습니다." },
    VACATION_PERIOD_PASSED :  { "isSuccess": false, "code": 3008, "message": "이미 지난 휴가는 취소할 수 없습니다." },
    VACATION_START_OVER_END :{ "isSuccess": false, "code": 3009, "message": "휴가 시작일이 휴가 마지막일보다 늦습니다." },
    VACATION_DAYS_OVER : { "isSuccess": false, "code": 3010, "message": "신청 휴가가 남은 연차를 초과했습니다." },
    VACATION_PERIOD_EXIST : { "isSuccess": false, "code": 3011, "message": "해당 기간에 등록된 휴가가 이미 존재합니다." },
    VACATION_NOT_PERMISSION :{ "isSuccess": false, "code": 3012, "message": "해당 휴가에 대한 권한이 없습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
    QUERY_ERROR : { "isSuccess": false, "code": 4002, "message": "데이터 베이스 쿼리 에러"},
    VALIDATION_ERROR :{"isSuccess": false, "code": 4003, "message": "validation 에러"}
}

export default ResponseMessage;