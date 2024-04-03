import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminHomeBody = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Welcome message */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4b5563' }}>Welcome Back, {adminInfo.name} !</h1>
          <p style={{ color: '#6b7280', fontSize: '1.25rem' }}>You are now logged in to your account.</p>
        </div>

        {/* User summary card */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '2rem', height: '2rem', color: '#4f46e5' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 008 0zM12 14a7 7 0 00-7 7v4a1 1 0 01-1-1v-4a7 7 0 00-7-7h4a1 1 0 011 1v4a7 7 0 007 7z" />
            </svg>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4b5563' }}>Admin</h3>
              <p style={{ color: '#6b7280', fontSize: '1.25rem' }}>{adminInfo.email}</p>
            </div>
          </div>
          <div style={{ color: '#6b7280', fontSize: '1rem' }}>
            <p>This is your home page after successful login. You can now access features and functionalities available to logged-in users.</p>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#4b5563', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <span>Go to Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeBody;
