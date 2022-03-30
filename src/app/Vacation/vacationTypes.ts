import { IsUUID, Contains, IsInt, Length, IsEmail, IsFQDN,
    IsDate, Min, Max, isInt } from "class-validator";
  

export class postVacationDto{
    constructor(req:any){
        this.type = req.type;
        this.startDate = req.startDate;
        this.endDate = req.endDate;
        this.comment = req.comment;
    }

    @IsInt()
    public type: number;

    public startDate: Date;

    public endDate: Date;

    public comment: string;
};