// 유저 생성
async function insertUser(connection:any, insertUserInfoParams:any) {
    const insertUserInfoQuery = `INSERT INTO User(email, password) VALUES (?, ?);`;
    await connection.query(insertUserInfoQuery,insertUserInfoParams);
}

// 이메일로 회원 조회
async function selectUserEmail(connection:any, email:string) {
    const selectUserEmailQuery = `SELECT userId, email FROM User WHERE email = ?;`;
    const emailRows = await connection.query(selectUserEmailQuery, email);
    return emailRows;
}

// 패스워드 체크
async function selectUserPassword(connection:any, selectUserPasswordParams:any) {
    const selectUserPasswordQuery = `SELECT email, password FROM User WHERE email = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(selectUserPasswordQuery,selectUserPasswordParams);
  
    return selectUserPasswordRow;
}
  
// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection:any, email:string) {
    const selectUserAccountQuery = `SELECT status, userId FROM User WHERE email = ?;`;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        email
    );
    return selectUserAccountRow;
}

// 유저 휴가수 조회
async function selectUserVacation(connection:any, userId: number) {
    const selectUserVacationQuery = `SELECT userId, vacationDays FROM User WHERE userId = ?;`;
    const [userVacationRows] = await connection.query(selectUserVacationQuery, [userId]);
    return userVacationRows;
}
    
// 유저 휴가수 업데이트 
async function updateUserVacation(connection:any, period: any, userId:number) {
    const selectUserAccountQuery = `UPDATE User SET vacationDays = vacationDays + ? WHERE userId = ?`;
    const userAccountRow = await connection.query(selectUserAccountQuery,[period, userId]);
    return userAccountRow;
}

// 유저 휴가수 업데이트 
async function updateAllUserVacation(connection:any, vacationDays: number) {
    const selectUserAccountQuery = `UPDATE User SET vacationDays = ? `;
    const userAccountRow = await connection.query(selectUserAccountQuery,[vacationDays]);
    return userAccountRow;
}


export{
    insertUser,
    selectUserEmail,
    selectUserPassword,
    selectUserAccount,
    selectUserVacation,
    updateUserVacation,
    updateAllUserVacation
}