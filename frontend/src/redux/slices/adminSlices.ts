import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


interface Admin {
  _id: string;
  email: string;
  role: string;
  
}


interface AdminAuthState {
  admin: Admin | null;
  adminToken: string | null;
}

const adminToken = localStorage.getItem("adminToken");

const initialState: AdminAuthState = {
  admin: adminToken ? jwtDecode<Admin>(adminToken) : null,
  adminToken: adminToken || null,
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLoginSuccess: (state, action: PayloadAction<string>) => {
      state.admin = jwtDecode<Admin>(action.payload);
      state.adminToken = action.payload;
      localStorage.setItem("adminToken", action.payload);
    },
    logout: (state) => {
      state.admin = null;
      state.adminToken = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { adminLoginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
