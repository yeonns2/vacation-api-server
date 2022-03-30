# Request Vacation System

## 기능 명세
* 사용자 모델과 로그인 시스템이 필요합니다.
    * 가입 기능은 없어도 괜찮습니다.
* 사용자에게는 매년 15일의 연차가 부여됩니다.
* 사용자는 연차/반차(0.5일)/반반차(0.25일)에 해당하는 휴가를 신청할 수 있습니다.
* 휴가 신청시 시작일, 종료일(반차/반반차의 경우는 필요없음), 사용 일수, 코멘트(선택 항목)를 입력합니다.
    * 휴가 신청시 남은 연차를 표시합니다.
    * 연차를 모두 사용한 경우 휴가를 신청할 수 없습니다.
    * 추가 기능: 사용 일수를 입력하는 대신 시작일, 종료일을 가지고 공휴일을 제외하고 계산해도 됩니다.
* 아직 시작하지 않은 휴가는 취소할 수 있습니다.

<br>


## **시나리오**
### **1. 회원가입/로그인**
> 회원가입 API 호출 -> 로그인 API 호출

1. 등록할 아이디와 비밀번호를 입력하여 `회원가입 API`를 호출한다. 
2. 해당 아이디가 존재하거나 비밀번호 형식이 맞지않으면 `validation 메세지`를 반환한다. 
3. 등록한 아이디와 비밀번호를 입력하여 `로그인 API`를 호출한다.
4. 아이디가 존재하지 않거나 비밀번호가 틀릴경우 각각 예외에 맞는 `validation 메세지`를 반환한다. 

### **2. 휴가 신청**
> 로그인 API 호출 -> 휴가 신청하기 API 호출

1. `로그인 API` 호출. 호출하여 얻은 `token`을 이후 요청들의 `header`에 포함한다.
2. 휴가 유형과 날짜, 코멘트(선택)을 넣은 뒤 `휴가 신청 API`를 호출한다. 주말과 공휴일은 휴가 일수에서 제외되어 계산된다.
3. 성공적으로 호출할 경우 `남은 휴가 날짜(remainingVacation)`를 응답으로 받는다.
4. 신청한 휴가 날짜가 현재 날짜보다 앞이거나, 남은 연차가 모자랄 경우에는 각각 예외에 맞는 `validation 메세지`를 반환한다. 

### **3. 휴가 취소**

> 로그인 API 호출 -> 휴가 신청 목록 API 호출 -> 휴가 상세 조회 API 호출 -> 휴가 취소 API 호출

1. `로그인 API` 호출. 호출하여 얻은 `token`을 이후 요청들의 `header`에 포함한다.
2. `휴가 목록 조회 API를 호출`하여 신청한 연차의 목록을 확인한다.
3. 조회된 목록에는 `휴가의 id`가 있으며 이를 이용해 취소하고 싶은 휴가 id로 `휴가 취소 API`를 호출한다.
4. 성공적으로 호출할 경우 `남은 휴가 날짜`를 응답으로 받는다.
5. 신청한 휴가 날짜가 현재 날짜보다 앞일 경우에는 각각 예외에 맞는 `validation 메세지`를 반환한다. 


### **4. 그 외**
- 매년 1월 1일 0시 0분에 모든 사용자의 연차가 15일로 업데이트 된다. (`node-cron` module 사용)
- 2022년, 2023년의 공휴일이 등록되어 있다. 

<br>



## **Endpoint** 
### **[API sheet](https://documenter.getpostman.com/view/12762028/UVsQsPPY)**

**base URL : `http://13.125.185.117:3000`**

- 회원가입: `[POST] /users/sign-up`
    - request body(example)
    
    ```
    {
      "id": "test@test.com",
      "password": "test123@"
    }
    ```
    
    - response body(example)
    
    ```
    {
       "isSuccess": true,
       "code": 1000,
       "message": "성공"
    }
    ```

- 로그인: `[POST] /users/sign-in`
    - request body(example)
    
    ```
    {
      "id": "test@test.com",
      "password": "test123@"
    }
    ```
    
    - response body(example)
    
    ```
    {
       "isSuccess": true,
       "code": 1000,
       "message": "성공",
       "result": {
           "userId": 1,
           "jwt":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0Nzg0MzQxOCwiZXhwIjoxNjc5Mzc5NDE4LCJzdWIiOiJ1c2VySW5mbyJ9.F7Hq_sqNHNM8YmRaH3MV4k-weXLt3KqEfXpWOanjIQ4"
       }
   }
    ```

- 휴가 신청 목록 조회 : `[GET] /vacations x-access-token: {token}`
    
    - response body(example)
    
    ```
    {
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "result": [
            {
                "vacationId": 2,
                "userId": 1,
                "type": 2,
                "startDate": "2022.03.23",
                "endDate": "2022.03.23",
                "period": 0.5,
                "comment": "병원",
                "createdAt": "2022.03.21"
            },
            {
                "vacationId": 5,
                "userId": 1,
                "type": 1,
                "startDate": "2022.12.24",
                "endDate": "2022.12.26",
                "period": 1,
                "comment": "연말 휴가 신청합니다!",
                "createdAt": "2022.03.22"
            }
        ]
    }
    ```

- 휴가 신청 : `[POST] /vacations x-access-token: {token}`
    - request body(example)
    
    ```
    {
       "type": 1,
       "startDate": "2022-05-04",
       "endDate": "2022-05-06",
       "comment" : "잠시 휴가 다녀오겠습니다."
   }
    ```
    
    - response body(example)
    
    ```
    {
       "isSuccess": true,
       "code": 1000,
       "message": "성공",
       "result": {
           "remainingVacation": 13
       }
   }
    ```

- 휴가 상세 조회  : `[GET] /vacations/:vacationId x-access-token: {token}`
    
    - response body(example)
    
    ```
    {
       "isSuccess": true,
       "code": 1000,
       "message": "성공",
       "result": {
           "vacationId": 2,
           "userId": 1,
           "type": 2,
           "startDate": "2022.03.23",
           "endDate": "2022.03.23",
           "period": 0.5,
           "comment": "병원",
           "createdAt": "2022.03.21"
       }
   }
    ```

- 휴가 삭제  : `[DELETE] /vacations/:vacationId x-access-token: {token}`
    
    - response body(example)
    
    ```
    {
       "isSuccess": true,
       "code": 1000,
       "message": "성공",
       "result": {
           "remainingVacation": 14.5
       }
   }
    ```





<br>



## Development Environment
- 사용 기술 : Node.js(Typescript), express.js, MySQL(RDBMS), PM2, VSCode
- 배포 : AWS EC2, AWS RDS 

<br>

## **서버 실행 방법**
### Installation

```bash
$ npm install
```

### Running the app

```bash
$ npm run start
```
<br>

## **Structure**

- `src`: 메인 로직 `src`에는 도메인 별로 패키지를 구성
- `config` 및 `util` 폴더: 메인 로직은 아니지만 `src` 에서 필요한 부차적인 파일들을 모아놓은 폴더
- 도메인 폴더 구조
    
    > Request(시작) / Response(끝) ⇄ Router (*Route.ts) ⇄ Controller (*Controller.ts) ⇄ Service (CUD) / Provider (R) ⇄ DAO (DB)
    > 

<br>

```
├── config                              # 
│   ├── baseResponseStatus.ts           # Response 시의 Status들을 모아 놓은 곳.
│   ├── database.ts                     # 데이터베이스 관련 설정
│   ├── express.ts                      # express Framework 설정 파일
│   ├── jwtMiddleware.ts                # jwt 관련 미들웨어 파일
│   ├── secret.ts                       # 서버 key 값들
│   ├── winston.ts                      # logger 라이브러리 설정
├── * log                               # 생성된 로그 폴더
├── * node_modules                      # 외부 라이브러리 폴더 (package.json 의 dependencies)
├── src                                 #
│   ├── app                             # 앱에 대한 코드 작성
│ 	 │   ├── User                        # User 도메인 폴더
│ 	 │   │   ├── userDao.ts              # User 관련 데이터베이스
│ 	 │   │   ├── userController.ts       # req, res 처리
│ 	 │   │   ├── userProvider.ts         # R에 해당하는 서버 로직 처리
│ 	 │   │   ├── userService.ts          # CUD에 해당하는 서버 로직 처리
│ 	 │   │   ├── userType.ts             # User 객체에 대한 Type  
├── .gitignore                          # git 에 포함되지 않아야 하는 폴더, 파일들을 작성 해놓는 곳
├── index.ts                            # 포트 설정 및 시작 파일                     		
├── * package-lock.json              	 
├── package.json                        # 프로그램 이름, 버전, 필요한 모듈 등 노드 프로그램의 정보를 기술
├── tsconfig.json                       # 타입스크립트 설정 파일
└── README.md
```

<br>

## **Usage**

### **[Node.js](https://nodejs.org/ko/)**

- `npm run start` 를 통해서 파일을 실행한다.
- node는 js 파일을 실행할 때 `package.json` 이라는 파일을 통해서 어떤 환경으로 구동하는지, 어떤 라이브러리들을 썼는지(dependencies) 등의 기본적인 설정값 들을 참고한다.
- `npm install` npm(node package manager)을 통해 package.json에 있는 dependencies 등을 참고하여 node_modules 폴더를 생성하고 라이브러리 파일을 다운로드 한다. 이 라이브러리들은 사용하고 싶은 파일에서 require 하여 사용할 수 있다.

### **[Express](https://expressjs.com/ko/)**
- config > express.ts 에서 express 프레임워크를 기반으로 한 app 모듈을 export 하도록 하여 어느 폴더에서든 사용할 수 있도록 구성했다.
- 도메인별로 해당 파일에 다음과 같이 Route 폴더를 추가하여 express.ts에서 만든 app 모듈을 사용할 수 있도록 구성했다.
- `index.ts`에서 express에서 만든 app이 3000번 포트를 Listen 하도록 구성했다.

### **[TypeScript](https://typescript-kr.github.io/)**
- 자바스크립트(JavaScript)를 기반으로 정적 타입 문법을 추가한 프로그래밍 언어
- 컴파일 시 Type Error를 빌드가 아닌 컴파일 작업에서 바로 수정할 수 있도록 하기 위해 사용했다.

### **[mysql2](https://www.npmjs.com/package/mysql2)**
- Database는 Mysql을 사용하여 데이터를 영구 저장할 수 있도록 했다. 
- Database는 config > database.ts에 mysql2 라이브러리를 사용해 구성했다. 

### **[winston](https://www.npmjs.com/package/winston)**
- Log는 winston, winston-daily-rotate-file 라이브러리를 사용해 구성했다. 
- 서버 접근 시에 생기게 될 log 폴더에서 로그를 확인할 수 있다.

### **[PM2](https://pm2.keymetrics.io/)**
- JavaScript 런타임 Node.js의 프로세스 관리자
- 무중단 서비스를 위해 PM2를 사용했다.
