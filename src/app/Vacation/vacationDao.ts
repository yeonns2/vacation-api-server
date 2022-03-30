// 휴가 목록 조회
async function selectVacation(connection: any, userId : number) {
  const selectVacationListQuery = `
      SELECT vacationId, userId, type, DATE_FORMAT(startDate, "%Y.%m.%d") AS startDate, DATE_FORMAT(endDate, "%Y.%m.%d") AS endDate, period, comment, DATE_FORMAT(createdAt, "%Y.%m.%d") AS createdAt 
      FROM Vacation 
      WHERE userId = ?;`;
  const vacationRows =  await connection.query(selectVacationListQuery,[userId]);
  return vacationRows;
}
  
// 휴가 생성
async function insertVacation(connection:any, insertVacationParams:any) {
  const insertVacationQuery = `
      INSERT INTO Vacation(userId, type, startDate, endDate, period, comment)
      VALUES (?, ?, ?, ?, ?, ?);
  `;
  const insertVacationRow = await connection.query(insertVacationQuery, insertVacationParams);
  return insertVacationRow;
}

// 휴가 상세 조회
async function selectVacationById(connection:any, vacationId:number) {
  const selectVacationQuery = `
      SELECT vacationId, userId, type, DATE_FORMAT(startDate, "%Y.%m.%d") AS startDate, DATE_FORMAT(endDate, "%Y.%m.%d") AS endDate, period, comment, DATE_FORMAT(createdAt, "%Y.%m.%d") AS createdAt  
      FROM Vacation WHERE vacationId = ?;
    `;
  const vacationRows = await connection.query(selectVacationQuery, [vacationId]);
  return vacationRows;
}

// 휴가 조회 (기간 내)
async function selectVacationByDate(connection:any, userId:number, startDate : Date, endDate : Date) {
  const selectVacationQuery = `SELECT vacationId, userId, type, DATE_FORMAT(startDate, "%Y.%m.%d") AS startDate, DATE_FORMAT(endDate, "%Y.%m.%d") AS endDate FROM Vacation WHERE userId = ?
  AND (startDate BETWEEN date(?) and date(?) OR endDate BETWEEN date(?) and date(?));`;
  const vacationRows = await connection.query(selectVacationQuery, [userId, startDate, endDate, startDate, endDate]);
  return vacationRows;
}


// 공휴일 조회
async function selectHoliday(connection: any,  startDate : Date, endDate : Date) {
  const selectHolidayQuery = `SELECT name, date FROM Holiday WHERE date BETWEEN DATE(?) AND DATE(?);`;
  const holidayRows =  await connection.query(selectHolidayQuery,[startDate, endDate]);
  return holidayRows;
}

// 휴가 삭제
async function deleteVacation(connection:any, vacationId:number) {
  const deleteVacationQuery = `DELETE FROM Vacation WHERE vacationId = ?`;
  await connection.query(deleteVacationQuery,[vacationId]);
}
  

  export {
    selectVacation,
    insertVacation,
    selectVacationById,
    selectVacationByDate,
    selectHoliday,
    deleteVacation
  };
  