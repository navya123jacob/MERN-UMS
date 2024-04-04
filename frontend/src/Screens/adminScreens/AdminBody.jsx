import React from 'react'
import HeaderAdmin from '../../Components/Admin/AdminHeader.jsx'
import AdminHomeBody from '../../Components/Admin/AdminBody.jsx'

const AdminHome = () => {
  return (
    <>
      <HeaderAdmin />
      <div className='admin-log-screen-bg'><AdminHomeBody /> </div>
       
    </>
  )
}

export default AdminHome