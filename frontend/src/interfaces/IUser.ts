export interface IUser {
    
    _id:string;
   name?: string;
  email: string;
 
  role?: string;
 
  isBlocked: boolean;
  location?:string;
  phone?:number;
  aboutMe?:string;
  

    
  }

  export interface CustomJwtPayload {
  id: string;
  email?: string;
  role?: string;
  sub?:string;
  name?:string;
  phone?:string;
  profileImage?:string;
}
export interface GetUser{
  success:boolean;
  message:string;
  user:IUser

}
export interface ProfileEdit{
  name?:string;
  email?:string;
  phone?:number;
  location?:string;
  bio?:string;
}
export interface UserUpdate{
  success:boolean;
  message:string;
  result?:IUser;
}
