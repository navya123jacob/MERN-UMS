import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice.js'
import { apiSlice } from './slices/ApiSlice.js';
const store=configureStore({
    reducer:{
        auth:AuthReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})

export default store