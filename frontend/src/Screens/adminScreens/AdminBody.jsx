import React, { useEffect } from 'react'
import HeaderAdmin from '../../Components/Admin/AdminHeader.jsx'
import AdminHomeBody from '../../Components/Admin/AdminBody.jsx'
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate} from 'react-router-dom'
import { FaWindows } from 'react-icons/fa'
const AdminHome = () => {
  const navigate = useNavigate();
  const {adminInfo} = useSelector((state)=> state.adminAuth );
  console.log("adming : ",adminInfo);
  useEffect(()=>{
    if(adminInfo==null){
      navigate('/admin');
      
    }
  },[])
  
  return (
    <>
      <HeaderAdmin />
      <div className='admin-log-screen-bg'><AdminHomeBody /> </div>
       
    </>
  )
}

export default AdminHome