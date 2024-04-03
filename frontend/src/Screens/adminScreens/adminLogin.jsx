import React, { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { useAdminLoginMutation } from '../../slices/adminSlice/adminApliSlice.js';
import { setAdminCredentials } from '../../slices/adminSlice/adminAuthSlice.js'
import {toast} from 'react-toastify'
import Loader from './Loader.jsx';
import { Form, Button, Row, Col } from 'react-bootstrap';


const AdminLogin = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const [adminLogin, {isLoading}] = useAdminLoginMutation();
  
    const {adminInfo} = useSelector((state)=> state.adminAuth );
  
    useEffect(()=>{
      if(adminInfo){
        navigate('/admin/home');
      }
    },[navigate,adminInfo])
    const validateForm = () => {
    
      let isValid = true;
  
      if (!email.trim()) {
        setEmailError('Email is required');
        isValid = false;
      } else {
        setEmailError('');
      }
  
      if (!password.trim()) {
        setPasswordError('Password is required');
        isValid = false;
      } else {
        setPasswordError('');
      }
  
      return isValid;
    };
  
     const submitHandler = async(e) => {
        e.preventDefault();

        if (!validateForm()) {
          return;
        }

        try {

          const res = await adminLogin({email,password}).unwrap();
          dispatch(setAdminCredentials({...res}));
          navigate('/admin/home')
        
        } catch (err) {
          console.log(err?.data?.message);
          toast.error(err?.data?.message || err.error);
        }
     }

  return (
    <div className="admin-screen-bg">
      <h1 className='text-white'>ADMIN </h1>
    <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label style={{ fontWeight: 'bold' }}>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label style={{ fontWeight: 'bold' }}>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="dark" className="mt-3">
          Sign In
        </Button>
        
          {isLoading && <Loader/>}
        
              </Form>
         
       
    
  </div>
  )
}

export default AdminLogin