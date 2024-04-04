import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './AdminWelcome.css';
const AdminHomeBody = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  return (
    <div className="container bodyadmin">
      <div className="heading">
        <h1>Welcome Back Navya {adminInfo.name} !</h1>
        <p>You are now logged in to your account.</p>
      </div>

      <div className="card">
        <div className="card-heading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 008 0zM12 14a7 7 0 00-7 7v4a1 1 0 01-1-1v-4a7 7 0 00-7-7h4a1 1 0 011 1v4a7 7 0 007 7z" />
          </svg>
          <div>
            <h3 className="card-heading">Admin</h3>
            <p>{adminInfo.email}</p>
          </div>
        </div>
        <div className="card-content">
          <p>This is your home page after successful login. You can now access features and functionalities available to logged-in users.</p>
        </div>
        <div className="action-button">
          <Link to="/admin/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeBody;
