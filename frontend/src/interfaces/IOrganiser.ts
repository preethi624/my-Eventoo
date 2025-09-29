export interface IOrganiser {
    _id: string;
    email: string;
    password: string;
    isBlocked: boolean;
    name?:string;
    authMethod?:string;
<<<<<<< HEAD
    
  
}


=======
    result?:[]
  
}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
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
<<<<<<< HEAD
export interface OrganiserPro{
=======
export interface OrganiserProfile{
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  count?:number;
  success?:boolean;
  
}
  