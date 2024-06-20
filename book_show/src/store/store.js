import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import { setUserFromLocalStorage } from "./authSlice";

const store = configureStore({
    reducer:{
             auth: authReducer
    }
});

store.dispatch(setUserFromLocalStorage());
export default store;