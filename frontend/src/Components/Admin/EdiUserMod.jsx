import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import { useUpdateUserDetailsMutation } from '../../slices/adminSlice/adminApliSlice.js';
import Loader from '../../Screens/adminScreens/Loader.jsx';

const EditUsersModal = ({userData,isOpen, onClose}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image , setImage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState('');

    const [updateProfileDetails, {isLoading}] = useUpdateUserDetailsMutation()
    

    useEffect(()=>{
        setName(userData.name);
        setEmail(userData.email);
        setImage(userData.profileImage);
    },[])


    const handleImageChange = (e)=>{
        const files = e.target.files[0];
        setSelectedImage(files);
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
        const isNameValid = /^[a-zA-Z _-]{3,16}$/.test(name);
        let errors = {};
    
        if (!isNameValid || name.trim()=='') {
            errors.name = 'Please Enter a valid name'
        }
        if (!isEmailValid || email.trim()=='') {
            errors.email = 'Please Enter a valid email';
        }
    
      if(Object.keys(errors).length > 0){
          toast.error(errors.name);
          toast.error(errors.email);
          return;
      }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('_id', userData._id);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('image', selectedImage);
            const res = await updateProfileDetails(formData).unwrap();
          
            toast.success('Profile updated');
           
            onClose();
        } catch (err) {
            toast.error(err?.data?.message||err.message);
        }
    };



  
  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
    <form>
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Profile</h3>
                {selectedImage ? (<img src={URL.createObjectURL(selectedImage)} className='h-28 w-28 rounded-full' alt="Selected" />) :
                    ( <img src={image} alt="" className='h-28 w-28 rounded-full' /> ) }
              <div className="mb-4">
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input type="file" onChange={handleImageChange} accept="image/*" name='image' className="mt-1 mb-2 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
              </div>
             
             <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
             
            </div>
          </div>
        </div>
        {isLoading && <Loader />}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button onClick={handleSave} type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
            Save
          </button>
          <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
    </form>
  </div>
  )
}

export default EditUsersModal