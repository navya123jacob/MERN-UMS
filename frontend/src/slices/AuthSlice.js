import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  document: null,
};

const AuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials:(state,action)=>{
      state.userInfo=action.payload;
      localStorage.setItem('userInfo',JSON.stringify(action.payload))  
    },
    logout:(state,action)=>{
       state.userInfo=null;
       localStorage.removeItem('userInfo')
    },
    setDocument: (state, action) => {
      state.document = action.payload;
    },

  }
});

export const { setCredentials, logout,setDocument } = AuthSlice.actions;

export default AuthSlice.reducer
