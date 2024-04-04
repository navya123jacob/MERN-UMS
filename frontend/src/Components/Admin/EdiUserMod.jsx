import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useUpdateUserDetailsMutation } from '../../slices/adminSlice/adminApliSlice.js';
import Loader from '../../Screens/adminScreens/Loader.jsx';

const EditUsersModal = ({ userData, setSelectedUser, isOpen, onClose }) => {
  
  const [Fname, setFName] = useState('');
  const [Lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [mno, setMno] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [updateProfileDetails] = useUpdateUserDetailsMutation();

  useEffect(() => {
    setFName(userData.Fname);
    setLName(userData.Lname);
    setEmail(userData.email);
    setImage(userData.image);
    setMno(userData.mno);
  }, [userData]);

  const handleImageChange = (e) => {
    setErrors({});
  const file = e.target.files[0];
  console.log(file)
  if (!file) return;

  if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
    setErrors({ ...errors, image: 'Please select a valid image file (PNG, JPEG, JPG, or WEBP).' });
    return;
  }

  setSelectedImage(file);

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 200; 
      const maxHeight = 200; 
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
    };
  };
  reader.readAsDataURL(file);
};
  const handleSave = async () => {
    setIsLoading(true);

    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    const isFNameValid = /^[a-zA-Z _-]{3,16}$/.test(Fname);
    const isLNameValid = /^[a-zA-Z _-]{3,16}$/.test(Lname);
    const isMnoValid = /^\d{10}$/.test(mno);

    const newErrors = {...errors};
    if (!isFNameValid || Fname.trim() === '') {
      newErrors.Fname = 'Please Enter a valid first name';
    }
    if (!isLNameValid || Lname.trim() === '') {
      newErrors.Lname = 'Please Enter a valid last name';
    }
    if (!isEmailValid || email.trim() === '') {
      newErrors.email = 'Please Enter a valid email';
    }
    if (!isMnoValid || mno.toString().trim() === '') {
      newErrors.mno = 'Please Enter a valid mobile number';
    }

    if (selectedImage && !selectedImage.type.startsWith('image/')) {
      newErrors.image = 'Please select an image file.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('_id', userData._id);
      formData.append('Fname', Fname);
      formData.append('Lname', Lname);
      formData.append('email', email);
      formData.append('mno', mno);
      if(selectedImage){
        formData.append('image', selectedImage);
      }
     
      const res = await updateProfileDetails(formData).unwrap();

      toast.success('Profile updated');
      setIsLoading(false);
      onClose();
    } catch (err) {
      
      toast.error(err?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {image && (
            <img src={image} className="rounded-full mx-auto mb-4" alt="Current Profile" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          )}
          {errors.image && <div className="text-red-500 mb-2">{errors.image}</div>}
          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" name='image' className="mt-1 mb-2 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label htmlFor="Fname" className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" value={Fname} onChange={(e) => setFName(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
            {errors.Fname && <div className="text-red-500">{errors.Fname}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="Lname" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" value={Lname} onChange={(e) => setLName(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
            {errors.Lname && <div className="text-red-500">{errors.Lname}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" readOnly disabled value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
            {errors.email && <div className="text-red-500">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="mno" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input type="text" value={mno} onChange={(e) => setMno(e.target.value)} className="mt-1 mb-2 ps-1 block w-full h-8 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
            {errors.mno && <div className="text-red-500">{errors.mno}</div>}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditUsersModal;
