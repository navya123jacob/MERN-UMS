import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddNewUserMutation } from '../../slices/adminSlice/adminApliSlice.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUserModal = ({ isOpen, onClose, setUsers, users }) => {
  
    const [userData, setUserData] = useState({
        Fname: '',
        Lname: '',
        email: '',
        mno: '',
        password: '',
    });
    const [selectedImage, setSelectedImage] = useState('');
    const [addNewUser, { isLoading }] = useAddNewUserMutation();
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            setErrors({ ...errors, image: 'Please select an image file.' });
            return;
        }
        
        setSelectedImage(file);
        setErrors({ ...errors, image: '' });
    };

    const validateSignupForm = () => {
        const errors = {};
        if (!userData.Fname) {
            errors.Fname = 'First name is required';
        }
        if (!userData.Lname) {
            errors.Lname = 'Last name is required';
        }
        if (!userData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!userData.mno) {
            errors.mno = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(userData.mno)) {
            errors.mno = 'Mobile number must be 10 digits';
        }
        if (!userData.password) {
            errors.password = 'Password is required';
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}/.test(userData.password)) {
            errors.password = 'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long';
        }
        if (!selectedImage) {
            errors.image = 'Profile image is required';
        } else if (!selectedImage.type.startsWith('image/')) {
            errors.image = 'Please select an image file.';
        }
        return errors;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formErrors = validateSignupForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('Fname', userData.Fname);
            formData.append('Lname', userData.Lname);
            formData.append('email', userData.email);
            formData.append('mno', userData.mno);
            formData.append('password', userData.password);
            formData.append('image', selectedImage);
            
            const newadded = await addNewUser(formData).unwrap();
            setUsers([...users, newadded]);
            
            toast.success('Added new user');
            onClose();
            
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };
  
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedImage && <img src={URL.createObjectURL(selectedImage)} className="profile-image" style={{ width: '150px', height: '150px', objectFit: 'cover' }} alt="Selected" />}
                <Form>
                    <Form.Group controlId="profileImage">
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                        {errors.image && <Form.Text className="text-danger">{errors.image}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="Fname">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={userData.Fname} onChange={(e) => setUserData({...userData, Fname: e.target.value})} />
                        {errors.Fname && <Form.Text className="text-danger">{errors.Fname}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="Lname">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={userData.Lname} onChange={(e) => setUserData({...userData, Lname: e.target.value})} />
                        {errors.Lname && <Form.Text className="text-danger">{errors.Lname}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                        {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="mno">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control type="text" value={userData.mno} onChange={(e) => setUserData({...userData, mno: e.target.value})} />
                        {errors.mno && <Form.Text className="text-danger">{errors.mno}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
                        {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUserModal;
