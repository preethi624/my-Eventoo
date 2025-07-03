

export interface IUser{
  _id: string;
    
    email: string;
    password: string;
    isBlocked: boolean;
    name?:string;
    authMethod?:string;
  
   phone?:number;
   location?:string;
   bio?:string;
   createdAt?: Date;
  updatedAt?: Date;



}
export interface LoginBody{
    email:string;
    password:string
}
export interface LoginResult{
    success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}
export interface LoginBody {
    email: string;
    password: string;
    userType?:string;
  }
export interface RegisterBody{
    name:string;
    email:string;
    password:string;
   
  }

export interface RegisterResult{
    success:boolean;
    message?:string|undefined;
    refreshToken?:string;
    accessToken?:string
  }
  export interface RegisterInput{
  name:string;
  email:string;
  password?:string;
  picture?:string;
  googleId?:string;
  authMethod?:string
}
export interface VerifyBody{
    name:string;
    email:string;
    password:string;
    otp:string;
    

  }
  export interface VerifyInput{
  name:string;
  email:string;
  password:string;
  otp:string;

}
export interface IOtp {
    _id: string;
    email: string;
    otp: string;
    createdAt: Date;
  }
  export interface Resend{
    email:string;
    userType?:string
  }
   export interface Forgot{
    email:string;
    otp:string;
    userType:string
  }

  export interface CredentialResponse{
    credential: string; // ID token (JWT)
  select_by?: "auto" | "user" | "user_1tap" | "user_2tap" | "btn" | "btn_confirm" | "btn_add_session" | "btn_confirm_add_session";
  clientId: string;
    
  }
  export interface GetUsers{
    result?:IUser[];
    message:string;
    success:boolean;
    user?:IUser

  }
  export interface EditUser{
  name:string;
  email:string;
  password?:string;
  phone?: string;
 
 

}
export interface IUserDTO{
  _id:string;
   name?: string;
  email: string;
 
  role?: string;
 
  isBlocked: boolean;


}