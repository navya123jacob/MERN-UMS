import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAdminlogoutMutation } from '../../slices/adminSlice/adminApliSlice';
import { adminLogout } from '../../slices/adminSlice/adminAuthSlice';
import { useDispatch } from 'react-redux';

const HeaderAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useAdminlogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(adminLogout());
      navigate('/admin');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="header-admin" >
      <div className="container flex flex-auto items-center h-full justify-between px-6">
        <div className="text-xl font-semibold text-white">MERN AUTH</div>

        <ul className="flex space-x-5">
          <Link to="/admin/dashboard">
            <li className="flex items-center">
              <FaUser className="icon text-white" />
              <span className="text text-white">Dashboard</span>
            </li>
          </Link>

          <li className="flex items-center" onClick={logoutHandler}>
            <FaSignOutAlt className="icon text-white" />
            <span className="text text-white">Logout</span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default HeaderAdmin;
