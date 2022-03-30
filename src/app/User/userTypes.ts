import { IsUUID, Contains, IsInt, Length, IsEmail, IsFQDN,
    IsDate, Min, Max } from "class-validator";
  
export class postUserDto{
    constructor(req:any){
        this.email = req.email;
        this.password = req.password;
    }

    @IsEmail()
    public email: string;

    @Length(8, 20)
    public password: string;
};