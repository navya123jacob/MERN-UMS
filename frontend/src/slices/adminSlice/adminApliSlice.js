import { apiSlice } from "../ApiSlice";
const ADMIN_URL = '/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        adminLogin: builder.mutation({
            query:(data)=> ({
                url:`${ADMIN_URL}`,
                method:'POST',
                body: data,
            })
        }),
        adminlogout: builder.mutation({
            query: () => ({
              url: `${ADMIN_URL}/logout`,
              method: 'POST'
            })
          }),
        getUsers: builder.mutation({
            query:()=> ({
                url: `${ADMIN_URL}/users`,
                method: 'GET'
            })
        }),
        updateUserDetails: builder.mutation({
            query:(data) => ({
                url:`${ADMIN_URL}/profile`,
                method:'PUT',
                body:data
            })
        }),
        addNewUser:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/users`,
                method:'POST',
                body:data
            })
        }),
        deleteUser:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/users`,
                method:'DELETE',
                body:data
            })
        })  

    })
})

export const {
    useAdminLoginMutation,
    useAdminlogoutMutation,
    useGetUsersMutation,
    useUpdateUserDetailsMutation,
    useAddNewUserMutation,
    useDeleteUserMutation
} = adminApiSlice