export interface IOrganiser {
    _id: string;
    email: string;
    password:string
    isBlocked: boolean;
    name?:string;
    authMethod?:string;
    status:string;
    latestBookedEvent?: {
    eventId: string;
    title: string;
    date: Date;
    venue: string;
    
    createdAt: Date;
  };
  
}


export interface GetOrganiser{
    message:string;
    success:boolean;
    result?:IOrganiser;

}
export interface GetOrgs{
  result?:IOrganiser[];
  message:string;
  success:boolean;
  organiser?:IOrganiser
}
export interface OrganiserDTO{
  name: string;
  email: string;
 
  role?: string;
  otp?: string;
  otpExpiry?: Date;
  isBlocked: boolean;
  authMethod?:string;
  status:string;
  latestBookedEvent?: {
    eventId: string;
    title: string;
    date: Date;
    venue: string;
    
    createdAt: Date;
  };
}
export interface IOrganiserDTO{
  _id:string
  name?: string;
  email: string;
 
  role?: string;
  otp?: string;
  otpExpiry?: Date;
  isBlocked: boolean;
  authMethod?:string;
  status:string;


}
export interface GetOrganisers{
    result?:IOrganiser[];
    message?:string;
    success?:boolean;
    total?:number

  }
