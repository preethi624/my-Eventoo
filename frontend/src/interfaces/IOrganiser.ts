export interface IOrganiser {
    _id: string;
    email: string;
    password: string;
    isBlocked: boolean;
    name?:string;
    authMethod?:string;
    result?:[]
  
}
export interface OrganiserDetails{
    name: string;
  email: string;
  password: string;
  role?: string;
  otp?: string;
  otpExpiry?: Date;
  isBlocked: boolean;
  authMethod?:string;
  status:string;
}
export interface OrganiserProfile{
  count?:number;
  success?:boolean;
}
  