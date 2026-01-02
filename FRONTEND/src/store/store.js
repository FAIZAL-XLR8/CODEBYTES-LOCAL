import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice"
import codeReducer from '../utils/codeSlice';
 const store = configureStore({
    reducer : {
        auth : authReducer,
        code : codeReducer
        // sliceName : reducerName
    }
})
export default store;