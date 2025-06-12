import {jwtDecode} from "jwt-decode"
import {createSlice} from "@reduxjs/toolkit"
import type{ CustomJwtPayload } from "../../interfaces/IUser";
const userToken=localStorage.getItem("userToken");
const organiserToken=localStorage.getItem("organiserToken");
const initialstate={
    user:userToken?jwtDecode<CustomJwtPayload>(userToken):null,
    userToken:userToken||null,
    organiser:organiserToken?jwtDecode<CustomJwtPayload>(organiserToken):null,
    organiserToken:organiserToken||null

}
const authSlice=createSlice({
    name:"auth",
    initialState:initialstate,
    reducers:{
        userLoginSuccess:(state,action)=>{
            state.user=jwtDecode<CustomJwtPayload>(action.payload);
            state.userToken=action.payload;
            localStorage.setItem("userToken",action.payload)
        },
        organiserLoginSuccess:(state,action)=>{
            state.organiser=jwtDecode<CustomJwtPayload>(action.payload);
            state.organiserToken=action.payload;
            localStorage.setItem("organiserToken",action.payload)
            
        },
       
        logout:(state)=>{
            state.user=null;
            state.userToken=null;
            state.organiser=null;
            state.organiserToken=null;
            localStorage.removeItem("userToken");
            localStorage.removeItem("organiserToken")
        }
    }
})
export const {userLoginSuccess,organiserLoginSuccess,logout}=authSlice.actions
export default authSlice.reducer