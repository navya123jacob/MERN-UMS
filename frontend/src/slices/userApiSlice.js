import { apiSlice } from "./ApiSlice";
const USERS_URL='/';

export const userApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
           query:(data)=>({
            url:`login`,
            method:'POST',
            body:data
           })
        }),
        register:builder.mutation({
           query:(data)=>({
            url:`register`,
            method:'POST',
            body:data
           })
        }),
        getUserById: builder.query({
         query: (id) => ({
           url: `user`,
           method: 'GET',
           params: { id } 
         })
        }),
        editUser: builder.mutation({
         query: (data) => ({
           url: `profile`,
           method: 'PUT',
           body:data
         })
        }),
       
    })
})

export const { useLoginMutation, useRegisterMutation, useGetUserByIdQuery, useEditUserMutation } = userApiSlice;
