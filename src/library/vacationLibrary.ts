import moment from "moment";
import * as vacationProvider  from "../app/Vacation/vacationProvider";
import * as userService  from "../app/User/userService";
import "moment-timezone";
import * as cron from "node-cron";

moment.tz.setDefault("Asia/Seoul");


const checkVacationDate =  async function (type: number, startDate:Date, endDate:Date) {

    let startMoment = moment(startDate);
    let endMoment = moment(endDate);

    if(startMoment > endMoment) return -1;
    if(type == 2) return 0.5;
    if(type == 3) return 0.25;

    const holidayList = await vacationProvider.retrieveHoliday(startMoment.toDate(),endMoment.toDate());
    let day = 0;
    let vacationDay = 0;

    for(let holiday of holidayList){
        let holidayMoment = moment(holiday.date);
        if(holidayMoment.day() != 0 && holidayMoment.day() != 6) day++;
    }
    
    while(1){
        if(startMoment.format('YYYY-MM-DD') > endMoment.format('YYYY-MM-DD')) return vacationDay - day;
        if(startMoment.day() != 0 && startMoment.day() != 6) vacationDay++;
        startMoment.add(1, 'days');
    }

    return vacationDay - day;
}

const vacationReset =  async function () {
    cron.schedule('0 0 1 1 *', async function () {
        await userService.updateAllUserVacation(15);
    });
}

export { checkVacationDate, vacationReset }

